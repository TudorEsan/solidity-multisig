// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiSigWallet {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);
    event AtlasActivationProposed(address indexed owner, address indexed atlasAddress);
    event AtlasDeactivationProposed(address indexed owner);
    event AtlasActivated(address indexed owner, address indexed atlasAddress);
    event AtlasDeactivated(address indexed owner);
    event AtlasConfirmed(address indexed owner, uint256 indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;
    address public atlasAddress;
    uint256 public atlasProposedActivationTime;
    address public atlasProposedActivationAddress;
    uint256 public atlasProposedDeactivationTime;
    uint public atlasChangeMinTime = 1 minutes;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
        bool atlasConfirmed;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0
                && _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(address _to, uint256 _value, bytes memory _data)
        public
        onlyOwner
    {
        uint256 txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0,
                atlasConfirmed: false
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function proposeAtlasActivation(address _atlasAddress)
        public
        onlyOwner
    {
        
        atlasProposedActivationTime = block.timestamp;
        atlasProposedActivationAddress = _atlasAddress;
        emit AtlasActivationProposed(msg.sender, _atlasAddress);
    }

    function activateAtlas() public onlyOwner {
        require(
            block.timestamp >= atlasProposedActivationTime + atlasChangeMinTime,
            "Atlas activation time not reached"
        );
        atlasAddress = atlasProposedActivationAddress;
        atlasProposedActivationAddress = address(0);
        atlasProposedActivationTime = 0;
        emit AtlasActivated(msg.sender, atlasAddress);
    }

    function proposeAtlasDeactivation() public onlyOwner {
        atlasProposedDeactivationTime = block.timestamp;
        emit AtlasDeactivationProposed(msg.sender);
    }

    function deactivateAtlas() public onlyOwner {
        require(
            block.timestamp >= atlasProposedDeactivationTime + atlasChangeMinTime,
            "Atlas deactivation time not reached"
        );
        atlasAddress = address(0);
        atlasProposedDeactivationTime = 0;
        emit AtlasDeactivated(msg.sender);
    }

    function confirmAtlas(uint256 _txIndex, bytes memory signature) public onlyOwner {
        require(atlasAddress != address(0), "Atlas not activated");
        require(_txIndex < transactions.length, "tx does not exist");
        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.atlasConfirmed, "Atlas already confirmed");

        bytes32 messageHash = keccak256(abi.encodePacked(_txIndex));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        (address recoveredAddress) = recoverSigner(ethSignedMessageHash, signature);
        require(recoveredAddress == atlasAddress, "Invalid signature");

        emit AtlasConfirmed(msg.sender, _txIndex);
        transaction.atlasConfirmed = true;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            // First 32 bytes after the length prefix
            r := mload(add(sig, 32))
            // Next 32 bytes
            s := mload(add(sig, 64))
            // Final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // Adjust for non-EIP-155 signatures
        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid signature version");
    }




    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];


        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        if (atlasAddress != address(0)) {
            require(transaction.atlasConfirmed, "Atlas not confirmed");
        }

        transaction.executed = true;

        (bool success,) =
            transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransactions()
        public
        view
        returns (Transaction[] memory)
    {
        return transactions;
    }

    function getApprovedOwners(uint256 _txIndex)
        public
        view
        returns (address[] memory)
    {
        address[] memory approvedOwners = new address[](owners.length);
        uint256 approvedOwnersCount = 0;

        for (uint256 i = 0; i < owners.length; i++) {
            if (isConfirmed[_txIndex][owners[i]]) {
                approvedOwners[approvedOwnersCount] = owners[i];
                approvedOwnersCount += 1;
            }
        }

        address[] memory result = new address[](approvedOwnersCount);
        for (uint256 i = 0; i < approvedOwnersCount; i++) {
            result[i] = approvedOwners[i];
        }

        return result;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}
