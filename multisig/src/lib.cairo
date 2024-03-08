#[starknet::contract]
mod Multisig {
    use core::array::ArrayTrait;
use starknet::{ContractAddress, get_caller_address, get_contract_address};

    #[storage]
    struct Storage {
        required_approvals: u32,
        owners: LegacyMap<ContractAddress, bool>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, _oweners: Array<ContractAddress>, _required_approvals: u32) {
        assert(_oweners.len() != 0, 'Must have at least one owner');
        assert(_required_approvals <= _oweners.len(), 'invalid required approvals');

        // copy the owners
        let limit = _oweners.len();
        let mut i = 0;
        loop {
            if i == limit {
                break;
            }
            let owner = *_oweners.at(i);
            self.owners.write(owner, true);
            i += 1;
        };

        // copy the threshold
        self.required_approvals.write(_required_approvals);
    }

    #[generate_trait]
    impl PrivateFunctions of PrivateFunctionsTrait {
    }

}