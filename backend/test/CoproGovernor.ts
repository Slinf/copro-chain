import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
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
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);
      var block = await hre.ethers.provider.getBlock("latest") ?? { number: 0 };

      //Act + Assert
      expect(await governorContract.quorum(block?.number)).to.equal(10e10);
    });
  })
  describe("votingDelay", () => {
    it("Should return the delay set in deployment", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.votingDelay()).to.equal(86400); // 1 day = 86400s
    });
  })
  describe("votingPeriod", () => {
    it("Should return the period set in deployment", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.votingPeriod()).to.equal(604800);// 1 week = 604800s
    });
  })
  describe("proposalThreshold", () => {
    //EveryBody part of the DAO can propose (1 copro token = 1 tantiem)
    it("Should return the proposalThreshold set", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      expect(await governorContract.proposalThreshold()).to.equal(hre.ethers.parseUnits("1", 18))
    });
  })
  describe("Voting Power", () => {
    describe.skip("addNewOwner", () => {
      it("Should success mint and update voting power", async function () {
        //Arrange
        const nowTimestamp = Math.floor(new Date().getTime() / 1000);
        const { owner, governorContract, account1, account2, tokenContract } = await loadFixture(deployCoproGovernorFixture);
        //precheck
        expect(await tokenContract.totalSupply()).to.equal(0);
        expect(await tokenContract.balanceOf(account1)).to.equal(0);
        expect(await tokenContract.balanceOf(account2)).to.equal(0);
        expect(await governorContract.getVotes(account1.address, nowTimestamp)).to.equal(0);
  
        //Act
        var res = await tokenContract.connect(owner).addNewOwner(account1, 100);
        res.wait();
        // avoid ERC5805FutureLookup(1743545275, 1743545258) with coverage
        await hre.ethers.provider.send("evm_mine", []);
        await new Promise(resolve => setTimeout(resolve, 500));

        const latestBlock = await hre.ethers.provider.getBlock("latest");
        const pastTimestamp = latestBlock.timestamp - 10; 
        
        //Assert
        expect(res).not.to.be
        .revertedWithCustomError(tokenContract,"OwnableUnauthorizedAccount");
        expect(await governorContract.getVotes(account1.address, pastTimestamp)).to.equal(hre.ethers.parseUnits("100", 18));
        expect(await tokenContract.totalSupply()).to.equal(hre.ethers.parseUnits("100", 18));
        expect(await tokenContract.balanceOf(account1)).to.equal(hre.ethers.parseUnits("100", 18));
        expect(await tokenContract.balanceOf(account2)).to.equal(0);
      });
    })
  })
  describe("Proposal Creation", () => {
    describe("propose", () => {
      it("Should allow proposal creation for copro token holder", async function () {
        // Arrange
        const { governorContract, account1, account2, tokenContract } = await loadFixture(deployCoproGovernorFixture);
        await tokenContract.addNewOwner(account1, 2);
        // Simuler le passage du temps (augmenter de 3600 secondes, soit 1 heure)
        await hre.ethers.provider.send("evm_increaseTime", [3600]);
        await hre.ethers.provider.send("evm_mine", []);  // Mine un nouveau bloc
        const targets = [account1.address];
        const values = [10];
        const calldatas = [hre.ethers.toUtf8Bytes("Proposal test")];
        const description = "Test proposal creation";
    
        // Act: Crée une proposition
        const res = await governorContract.connect(account1).propose(targets, values,calldatas,description);

        // Assert: Vérifie que l'événement est émis
        expect(res).to
        .emit(governorContract, "ProposalCreated")
        .withArgs(account1.address, description);
      });
      it("Should revert, proposal creation not allowed if account balance is empty", async function () {
        // Arrange
        const { governorContract, account1 } = await loadFixture(deployCoproGovernorFixture);
        
        const targets = [account1.address];
        const values = [10];
        const calldatas = [hre.ethers.toUtf8Bytes("Proposal test")];
        const description = "Test proposal creation";
    
        // Act + Assert 
        await expect(governorContract.connect(account1).propose(targets, values,calldatas,description)).to.be
        .revertedWithCustomError(governorContract,"GovernorInsufficientProposerVotes")
        .withArgs(account1, 0, hre.ethers.parseUnits("1", 18));
      });
    });
    describe("makeProposition", () => {
      it("Should save details of proposition in array", async () => {
        const { governorContract, account1, tokenContract } = await loadFixture(deployCoproGovernorFixture);
        await tokenContract.addNewOwner(account1, 1);
        const targets = [account1.address];
        const values = [10];
        const calldatas = [hre.ethers.toUtf8Bytes("Proposal test")];
        const description = "Test proposal creation";
        const newProposal = {  
          id: 0,  
          title: "Rénovation de l'entrée",
          description: "Description des tâche",
          content: "Content",
          executed: false }
    
        // Act: Crée une proposition
        const res = await governorContract.connect(account1).makeProposition(
          newProposal, 
          targets, 
          values,
          calldatas);

        // Assert: Vérifie que l'événement est émis
        expect(res).to
        .emit(governorContract, "ProposalCreated")
        .withArgs(account1.address, description);
      })
    })
  })
});
