import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("CoproGovernor", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCoproGovernorFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2 ] = await hre.ethers.getSigners();

    // Retrieve CoproToken and deploy it 
    const Token = await hre.ethers.getContractFactory("CoproToken");
    const tokenContract = await Token.deploy(owner.address, { });
    
    // Retrieve CoproGovernor and deploy it 
    const Governor = await hre.ethers.getContractFactory("CoproGovernor");
    const governorContract = await Governor.deploy(tokenContract.getAddress(), { });

    return { governorContract, tokenContract, owner, account1, account2 };
  }

  describe("Deployment", () => {
    it("Should set Governor name", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.name()).to.equal("CoproGovernor");
    });
    it("Should set right Governor settings", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.votingDelay()).to.equal(86400); // 1 day = 86400s
      expect(await governorContract.votingPeriod()).to.equal(604800);// 1 week = 604800s
    });
    it("Should set the token pass in params as governance token", async function () {
      //Arrange
      const { governorContract , tokenContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.token()).to.equal(await tokenContract.getAddress());
    });
  });
  describe("quorum", () => {
    it("Should return the quorum set", async function () {
      //Arrange
      const { governorContract , tokenContract } = await loadFixture(deployCoproGovernorFixture);
      var block = await hre.ethers.provider.getBlock("latest") ?? { number: 0 };

      //Act + Assert
      expect(await governorContract.quorum(block?.number)).to.equal(10e10);
    });
  })
  describe("votingDelay", () => {
    it("Should return the delay set in deployment", async function () {
      //Arrange
      const { governorContract , tokenContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.votingDelay()).to.equal(86400); // 1 day = 86400s
    });
  })
  describe("votingPeriod", () => {
    it("Should return the period set in deployment", async function () {
      //Arrange
      const { governorContract , tokenContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.votingPeriod()).to.equal(604800);// 1 week = 604800s
    });
  })
  describe("proposalThreshold", () => {
    //EveryBody can propose
    it("Should return the proposalThreshold set", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.proposalThreshold()).to.equal(0)
    });
  })
  describe("Proposal Creation", () => {
    it("Should allow proposal creation", async function () {
      // Arrange
      const { governorContract, account1, account2 } = await loadFixture(deployCoproGovernorFixture);
      
      const targets = [account1.address];
      const values = [10];
      const calldatas = [hre.ethers.toUtf8Bytes("Proposal test")];
      const description = "Test proposal creation";
  
      // Act: Crée une proposition
      const res = await governorContract.connect(account1).propose(targets, values,calldatas,description);
      res.wait();

      // Assert: Vérifie que l'événement est émis
      expect(res).to
      .emit(governorContract, "ProposalCreated")
      .withArgs(account1.address, description);
    });
  })
  // describe("Token Voting Integration", function () {
  //   it("Should count votes correctly based on token balance", async function () {
  //     // Arrange
  //     const { governorContract, tokenContract, account1, account2 } = await loadFixture(deployCoproGovernorFixture);
  
  //     // Créez une proposition
  //     const targets = [account1.address];
  //     const values = [0];
  //     const calldatas = [hre.ethers.toUtf8Bytes("Proposal test")];
  //     const description = "Test proposal creation";
  
  //     const trx = await governorContract.connect(account1).propose(targets, values, calldatas, description);
  //     const receipt = await trx.wait()

  //     // Vérifiez que les utilisateurs ont des jetons
  //     const balanceBefore = await tokenContract.balanceOf(account2.address);
  
  //     // Act: Voter sur la proposition

  //     const proposalId = receipt.events?.find(event => event.event === "ProposalCreated")?.args?.proposalId;
  //     const voteTx = await governorContract.connect(account2).castVote(proposalId, 1); // Voter pour
  //     await voteTx.wait();
  
  //     // Assert: Vérifiez l'impact du vote en fonction du solde des jetons
  //     const balanceAfter = await tokenContract.balanceOf(account2.address);
  //     expect(balanceBefore).to.equal(balanceAfter); // Le solde en jetons ne change pas, mais les votes sont comptabilisés
  //   });
  // });
});
