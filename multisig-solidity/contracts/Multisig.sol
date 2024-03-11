
pragma solidity ^0.8.19;

contract Multisig {
  address[] public owners;

  constructor(address[] memory _owners, uint _threshold) {
    assert(_threshold <= _owners.length);
    // TODO: check that owners are unique
    owners = _owners;
  }

  function getOwners() public view returns (address[] memory) {
    return owners;
  }

  function getThreshold() public view returns (uint) {
    return owners.length;
  }
  
}