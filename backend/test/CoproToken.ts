import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("CoproToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCoproTokenFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2 ] = await hre.ethers.getSigners();

    // Retrieve CoproToken and deploy it 
    const Token = await hre.ethers.getContractFactory("CoproToken");
    const tokenContract = await Token.deploy(owner.address, { });

    return { tokenContract, owner, account1, account2 };
  }

  describe("Deployment", () => {
    it("Should set the syndic to deployer adress", async function () {
      //Arrange
      const { tokenContract, owner} = await loadFixture(deployCoproTokenFixture);

      //Act + Assert
      expect(await tokenContract.syndic()).to.equal(owner);
    });
    it("Should set right tokenContract name & symbol from ERC20", async function () {
      //Arrange
      const { tokenContract } = await loadFixture(deployCoproTokenFixture);

      //Act + Assert
      expect(await tokenContract.name()).to.equal("CoproToken");
      expect(await tokenContract.symbol()).to.equal("COPRO");
    });
    it("Should set owner and access to owner method from Ownable", async function () {
      //Arrange
      const { tokenContract, owner } = await loadFixture(deployCoproTokenFixture);

      //Act + Assert
      expect(await tokenContract.owner()).to.equal(owner);
    });
    it("Should set domain with CoproToken", async function () {
      //Arrange
      const { tokenContract } = await loadFixture(deployCoproTokenFixture);

      //Act
      var domain = await tokenContract.eip712Domain()

      //Assert
      expect(domain[0]).to.equal("0x0f");
      expect(domain[1]).to.equal("CoproToken");
      expect(domain[2]).to.equal("1");
    });
    it("Total Supply should be 0", async function () {
      //Arrange
      const { tokenContract } = await loadFixture(deployCoproTokenFixture);

      //Act + Assert
      expect(await tokenContract.totalSupply()).to.equal(0);
    }); 
  });
  describe("distributeToken", () => {
    it("Should be sucess when call from contract owner", async function () {
      //Arrange
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);
      var owners = [ 
        {
          accountAddress: owner.address,
          tantiem: 10
        },
        {
          accountAddress: account1.address,
          tantiem: 10
        },
      ];
      //Act
      var tx = await tokenContract.distributeToken(owners);
      const res = await tx.wait(); 

      //Assert
      expect(res?.status).to.equal(1);
      const totalSupplyExepected = hre.ethers.parseUnits("20", 18);
      expect(await tokenContract.totalSupply()).to.equal(totalSupplyExepected);
    });
    it("Should modify balances", async function () {
      //Arrange
      const { tokenContract, owner, account1, account2} = await loadFixture(deployCoproTokenFixture);
      var owners = [ 
        {
          accountAddress: owner.address,
          tantiem: 50
        },
        {
          accountAddress: account1.address,
          tantiem: 20
        },
        {
          accountAddress: account2.address,
          tantiem: 40
        },
      ];

      //Act
      var res = await tokenContract.distributeToken(owners);

      //Assert
      expect(await tokenContract.totalSupply()).to.equal(hre.ethers.parseUnits("110", 18));
      expect(await tokenContract.balanceOf(owner)).to.equal(hre.ethers.parseUnits("50", 18));
      expect(await tokenContract.balanceOf(account1)).to.equal(hre.ethers.parseUnits("20", 18));
      expect(await tokenContract.balanceOf(account2)).to.equal(hre.ethers.parseUnits("40", 18));

    });
    it("Should emit event TokensDistributed when sucess call from contract owner", async function () {
      //Arrange
      const { tokenContract, owner, account1, account2} = await loadFixture(deployCoproTokenFixture);
      var owners = [ 
        {
          accountAddress: owner.address,
          tantiem: 50
        },
        {
          accountAddress: account1.address,
          tantiem: 20
        },
        {
          accountAddress: account2.address,
          tantiem: 40
        },
      ];

      //precheck
      expect(await tokenContract.totalSupply()).to.equal(0);
      expect(await tokenContract.balanceOf(owner)).to.equal(0);
      expect(await tokenContract.balanceOf(account1)).to.equal(0);

      //Act
      var res = await tokenContract.distributeToken(owners);

      //Assert
      expect(res).to
        .emit(tokenContract, "TokensDistributed")
        .withArgs(owner.address, 50);
      
      expect(res).to
        .emit(tokenContract, "TokensDistributed")
        .withArgs(account1.address, 20);
      
      expect(res).to
        .emit(tokenContract, "TokensDistributed")
        .withArgs(account2.address, 40);

    });
    it("Should revert when call from unknown source", async function () {
      //Arrange
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);
      var owners = [ 
        {
          accountAddress: owner.address,
          tantiem: 50
        },
        {
          accountAddress: account1.address,
          tantiem: 20
        }
      ];

      //Act and Assert
      await expect(tokenContract.connect(account1).distributeToken(owners)).to.be
      .revertedWithCustomError(tokenContract,"OwnableUnauthorizedAccount")
      .withArgs(account1);
    });
  })
  describe("addNewOwner", () => {
    it("Should revert if someone other than owner try to call addNewOwner", async function () {
      //Arrange
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);

      //Act + Assert
      await expect(tokenContract.connect(account1).addNewOwner(account1, 1000)).to.be
      .revertedWithCustomError(tokenContract,"OwnableUnauthorizedAccount")
      .withArgs(account1);
      expect(await tokenContract.totalSupply()).to.equal(0);
      expect(await tokenContract.balanceOf(account1)).to.equal(0);
      expect(await tokenContract.balanceOf(owner)).to.equal(0);
    });
    it("Should success if owner call addNewOwner", async function () {
      //Arrange
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);

      //precheck
      expect(await tokenContract.totalSupply()).to.equal(0);
      expect(await tokenContract.balanceOf(owner)).to.equal(0);
      expect(await tokenContract.balanceOf(account1)).to.equal(0);

      //Act
      var res = await tokenContract.connect(owner).addNewOwner(account1, 100);

      //Assert
      expect(res).not.to.be
      .revertedWithCustomError(tokenContract,"OwnableUnauthorizedAccount");
      expect(await tokenContract.totalSupply()).to.equal(hre.ethers.parseUnits("100", 18));
      expect(await tokenContract.balanceOf(account1)).to.equal(hre.ethers.parseUnits("100", 18));
      expect(await tokenContract.balanceOf(owner)).to.equal(0);
    });
    it("Should emit TokensMinted event", async () => {
      //Arrange
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);

      //Act
      var res = await tokenContract.addNewOwner(account1, 100);

      //Assert
      expect(res).to
        .emit(tokenContract, "TokensMinted")
        .withArgs(account1, 100);
    });
    it("Should emit TokensDelegatedForVote event", async () => {
      //Arrange
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);

      //Act
      var res = await tokenContract.addNewOwner(account1, 100);

      //Assert
      expect(res).to
        .emit(tokenContract, "TokensDelegatedForVote")
        .withArgs(account1, account1);
    });
  })
  describe("clock", () => {
    it("Should return block timestamp", async () => {
      const { tokenContract, owner, account1} = await loadFixture(deployCoproTokenFixture);
      //Arrange
      var block = await hre.ethers.provider.getBlock("latest");

      //Act + Assert
      expect((await tokenContract.clock())).to.equal(block?.timestamp);
    });
  })
  describe("CLOCK_MODE", () => {
    it("Should return timestamp as clock mode", async () => {
      const { tokenContract} = await loadFixture(deployCoproTokenFixture);

      //Act + Assert
      expect(await tokenContract.CLOCK_MODE()).to.equal("mode=timestamp");
    });
  })
  describe("nonces", () => {
    it("Should return initial nonce of specified address", async () => {
      const { tokenContract, owner, } = await loadFixture(deployCoproTokenFixture);

      const initialNonce = await tokenContract.nonces(owner.address);
      expect(initialNonce).to.equal(0)
    });
  });
});
