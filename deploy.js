const hre = require("hardhat");
async function main() {
  const Poll = await hre.ethers.getContractFactory("ConfidentialPoll");
  const poll = await Poll.deploy();
  await poll.deployed();
  console.log("Deployed at:", poll.address);
}
main();
