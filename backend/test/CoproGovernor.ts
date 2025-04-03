import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { hash } from "crypto";
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

  async function deployCoproGovernorAndAddOneOwnerFixture() {
    const { owner, governorContract, account1, account2, tokenContract } = await loadFixture(deployCoproGovernorFixture);
        await tokenContract.addNewOwner(account1, 1);
        const targets = [account1.address];
        const values = [10];
        const calldatas = [hre.ethers.toUtf8Bytes("Proposal test")];
        const newProposal = {  
          title: "Rénovation de l'entrée",
          description: "Description des tâche",
          content: "Content" }

    return { owner, account1, governorContract, newProposal, calldatas, values, targets };
  }

  async function deployCoproGovernorAndMultipleProposalsFixture() {
    const { owner, account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndAddOneOwnerFixture);
    //Act Assert
    var res = await governorContract.connect(account1).makeProposition(
      newProposal,
      targets,
      values, 
      calldatas 
    );
    res.wait();
    var res2 = await governorContract.connect(account1).makeProposition(
      {  
        title: "Autre proposition",
        description: "Voici une description",
        content: "..." 
      },
      targets,
      values, 
      calldatas 
    );
    res2.wait();
    var res3 = await governorContract.connect(account1).makeProposition(
      {  
        title: "Ceci est la 3ème proposition",
        description: "AHAHAh on avance on avance",
        content: "YEAH" 
      },
      targets,
      values, 
      calldatas 
    );
    res3.wait();

    var proposal1 = res.data;
    return { owner, proposal1, account1, governorContract, newProposal, calldatas, values, targets };
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
      //expect(await governorContract.votingDelay()).to.equal(86400); // 1 day = 86400s
      //expect(await governorContract.votingPeriod()).to.equal(604800);// 1 week = 604800s
      expect(await governorContract.votingDelay()).to.equal(1); 
      expect(await governorContract.votingPeriod()).to.equal(60);
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
      //expect(await governorContract.votingDelay()).to.equal(86400); // 1 day = 86400s
      expect(await governorContract.votingDelay()).to.equal(1); 
    });
  })
  describe("votingPeriod", () => {
    it("Should return the period set in deployment", async function () {
      //Arrange
      const { governorContract } = await loadFixture(deployCoproGovernorFixture);

      //Act + Assert
      //expect(await governorContract.votingPeriod()).to.equal(604800);// 1 week = 604800s
      expect(await governorContract.votingPeriod()).to.equal(60);// 1 week = 604800s
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
    describe("addNewOwner", () => {
      it.skip("Should success mint and update voting power", async function () {
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
      it("Should proposalCount match expected", async () => {
        const { account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndAddOneOwnerFixture);

        expect(await governorContract.proposalCount()).to.equal(0);

        //Act
        var res = await governorContract.connect(account1).makeProposition(
          newProposal,
          targets,
          values, 
          calldatas 
        );
        res.wait();

        //Assert
        expect(await governorContract.proposalCount()).to.equal(1);
      })
      it("should save the new proposition", async function () {
        const { account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndAddOneOwnerFixture);
       
        //Act Assert
        await expect(
          governorContract.connect(account1).makeProposition(
            newProposal,
            targets,
            values, 
            calldatas 
          )
        ).emit(governorContract, "ProposalCreated");
      });
      it("Should proposalCount match expected", async () => {
        const { account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndAddOneOwnerFixture);
        expect(await governorContract.proposalCount()).to.equal(0);

        //Act Assert
        var res = await governorContract.connect(account1).makeProposition(
          newProposal,
          targets,
          values, 
          calldatas 
        );
        res.wait();

        expect(await governorContract.proposalCount()).to.equal(1);
      })
      it("Should save main info in governor contracts", async () => {
        const { account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndAddOneOwnerFixture);
        expect(await governorContract.proposalCount()).to.equal(0);

        //Act Assert
        var res = await governorContract.connect(account1).makeProposition(
          newProposal,
          targets,
          values, 
          calldatas 
        );
        res.wait();
        var res2 = await governorContract.connect(account1).makeProposition(
          {  
            title: "Autre proposition",
            description: "Voici une description",
            content: "..." 
          },
          targets,
          values, 
          calldatas 
        );
        res2.wait();

        var res3 = await governorContract.connect(account1).makeProposition(
          {  
            title: "Ceci est la 3ème proposition",
            description: "AHAHAh on avance on avance",
            content: "YEAH" 
          },
          targets,
          values, 
          calldatas 
        );
        res3.wait();

        var proposals = await governorContract.getAllPropositions(0, 2);
        const formattedProposals = proposals.map(proposal => ({
          id: proposal.id.toString(),  // Conversion BigNumber → Number
          title: proposal.title,
          state: proposal[2],
          votes: proposal[3]
        }));

        expect(formattedProposals.length).to.equal(3)
        expect(formattedProposals[0].title).to.equal("Rénovation de l'entrée")
        expect(formattedProposals[1].title).to.equal("Autre proposition")
        expect(formattedProposals[2].title).to.equal("Ceci est la 3ème proposition")
      });
    })
  })
  describe("Get Infos", () => {
    describe("getAllPropositions", () => {
      it("Should revert with OutOfBoundError", async () => {
        const { governorContract } = await loadFixture(deployCoproGovernorAndMultipleProposalsFixture);

        await expect(governorContract.getAllPropositions(0,10)).to.be.revertedWithCustomError(governorContract,"OutOfBoundError");
      });
      it("Should revert with InvalidOrderRangeError", async () => {
        const { governorContract } = await loadFixture(deployCoproGovernorAndMultipleProposalsFixture);

        await expect(governorContract.getAllPropositions(3,0)).to.be.revertedWithCustomError(governorContract,"InvalidOrderRangeError");
      });
      it("Should revert with InvalidRangeError", async () => {
        const { governorContract, account1 } = await loadFixture(deployCoproGovernorAndMultipleProposalsFixture);

        for (let i = 0; i < 30; i++) {
          var title = `Ceci est la ${i} proposition`;
          var description = `description ${i}`;
          var content = `Content ${i}`;
          await governorContract.connect(account1).makeProposition(
            {  
              title: title,
              description: description,
              content: content 
            },        
            [account1.address],
            [0], 
            [hre.ethers.toUtf8Bytes("Proposal test")]);
        }
        await expect(governorContract.getAllPropositions(0,21)).to.be.revertedWithCustomError(governorContract,"InvalidRangeError");
      });
    })
  })
  describe("Vote", () => {
    it("Should success to vote and update score", async () => {
      const { proposal1, account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndMultipleProposalsFixture); 
      var id = "73984644665711994740788300719172920271804219374445738186094308245127487564796";
      expect(await governorContract.state(id)).to.equal(1);

      var res = await governorContract.connect(account1).castVote(id, 1);
      await res.wait();

      await expect(res).to
      .emit(governorContract, "VoteCast")
      .withArgs(account1, id, 1, hre.ethers.parseUnits("1", 18), "");
      
      var scores = await governorContract.proposalVotes(id);
      expect(scores[0]).to.equal(0);// against
      expect(scores[1]).to.equal(hre.ethers.parseUnits("1", 18));// for
      expect(scores[2]).to.equal(0);
    })
    it("Should success and score no update if no voting power", async () => {
      const { owner, proposal1, account1, governorContract, newProposal, targets, values, calldatas } = await loadFixture(deployCoproGovernorAndMultipleProposalsFixture); 
      var id = "73984644665711994740788300719172920271804219374445738186094308245127487564796";
      expect(await governorContract.state(id)).to.equal(1);

      var res = await governorContract.castVote(id, 1);
      await res.wait();

      await expect(res).to
      .emit(governorContract, "VoteCast")
      .withArgs(owner, id, 1, 0, "");
      
      var scores = await governorContract.proposalVotes(id);
      expect(scores[0]).to.equal(0);// against
      expect(scores[1]).to.equal(0);// for
      expect(scores[2]).to.equal(0);
    })
  })
});
