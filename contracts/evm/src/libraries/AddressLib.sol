// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

enum ChainType {
    EVM,
    BITCOIN
}

struct UniversalAddress {
    ChainType chain;
    bytes data;
}

struct Address {
    UniversalAddress source;
    UniversalAddress destination;
}

library AddressLib {
    function toEthAddress(UniversalAddress memory addr) internal pure returns (address ethAddr) {
        require(addr.chain == ChainType.EVM, "AddressLib: Invalid chain type");
        require(addr.data.length == 20, "AddressLib: Invalid address length");
        bytes memory _bytes = addr.data;
        assembly {
            ethAddr := mload(add(_bytes, 20))
        }
    }

    function fromEthAddress(address ethAddr) internal pure returns (UniversalAddress memory addr) {
        bytes memory _bytes = abi.encodePacked(ethAddr);
        assembly {
            mstore(add(_bytes, 20), ethAddr)
        }
        addr.chain = ChainType.EVM;
        addr.data = _bytes;
    }
}
