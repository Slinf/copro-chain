import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("CoproToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCoproTokenFixture() {
   
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("CoproToken");
    const token = await Token.deploy(owner.address, { });

    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the syndic to deployer adress", async function () {
      const { token, owner} = await loadFixture(deployCoproTokenFixture);

      expect(await token.syndic()).to.equal(owner);
    });

    it("Should set right token name & symbol from ERC20", async function () {
      const { token } = await loadFixture(deployCoproTokenFixture);

      expect(await token.name()).to.equal("CoproToken");
      expect(await token.symbol()).to.equal("COPRO");
    });

    it("Should set owner and access to owner method from Ownable", async function () {
      const { token, owner } = await loadFixture(deployCoproTokenFixture);

      expect(await token.owner()).to.equal(owner);
    });

    it("Should set domain with CoproToken", async function () {
      const { token, owner } = await loadFixture(deployCoproTokenFixture);

      var domain = await token.eip712Domain()
      expect(domain[0]).to.equal("0x0f");
      expect(domain[1]).to.equal("CoproToken");
      expect(domain[2]).to.equal("1");
    });
  });
});
