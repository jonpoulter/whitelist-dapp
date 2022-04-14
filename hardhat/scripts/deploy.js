const {ethers} = require("hardhat");

const MAX_WHITELIST_ADDRESSES = 10;

async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  //Send transaction for contract to be deployed
  const deployedWhitelistContract = await whitelistContract.deploy(MAX_WHITELIST_ADDRESSES);

  //The address the contract WILL have once mined.
  console.log("Whitelist Contract Address: ", deployedWhitelistContract.address);

  //Wait for it to finished deploying - we must wait until it is mined.
  await deployedWhitelistContract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });