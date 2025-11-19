const { expect } = require("chai");
describe("ConfidentialPoll", function () {
  it("deploys", async function () {
    const Poll = await ethers.getContractFactory("ConfidentialPoll");
    const poll = await Poll.deploy();
    expect(await poll.deployed()).to.be.ok;
  });
});
