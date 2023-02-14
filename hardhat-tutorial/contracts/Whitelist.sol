//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    // max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;

    //create a mapping of whitelisted addresses
    //if an address is whitelisted, we would set it to true, it is false by default for all other addresses
    mapping(address => bool) public whitelistedAddresses;

    //numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    // NOTE: Don't change this variable name, as it will be part of verification
    uint8 public numAddressesWhitelisted;

    //setting the max number of whitelisted addresses
    //user will put the value at the time of deployment
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    //addAddressToWhitelist - this function adds the address of the sender to the whitelist

    function addAddressToWhitelist() public {
        //check if the user has already been whitelisted
        require(
            !whitelistedAddresses[msg.sender],
            "Sender has are already been whitelisted"
        );
        //check if the number of addresses whitelisted is less than the max number of addresses allowed
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "More addresses cant be added, limit reached"
        );
        // add the address which called the function to the whitelistedAddress array
        whitelistedAddresses[msg.sender] = true;
        //increment the number of addresses whitelisted
        numAddressesWhitelisted++;
    }
}
