//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {

  uint8 public maxWhitelistedAddresses;

  mapping(address => bool) public whitelistedAddresses;

  uint8 public numAddressesWhitelisted;

  event AddressWhitelistedEvent(address indexed _address);

  constructor(uint8 _maxWhitelistedAddresses) {
    maxWhitelistedAddresses = _maxWhitelistedAddresses;
  }

  function addAddressToWhitelist() public {
    require(numAddressesWhitelisted < maxWhitelistedAddresses, "Reached maximum of white listed addresses");
    require(!whitelistedAddresses[msg.sender], "The address is already white listed!");
    address _address = msg.sender;
    whitelistedAddresses[_address] = true;
    numAddressesWhitelisted++;
    emit AddressWhitelistedEvent(_address);
  }


}



