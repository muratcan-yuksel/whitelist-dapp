const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */

  const whitelistContract = await ethers.getContractFactory("Whitelist");

  // Deploy the contract to the network
  //10 is the maximum number of whitelisted addresses allowed
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  // Wait for the contract to be deployed
  await deployedWhitelistContract.deployed();

  //print the address of the deployed contract
  console.log("whitelist contract address:", deployedWhitelistContract.address);
}

//call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
