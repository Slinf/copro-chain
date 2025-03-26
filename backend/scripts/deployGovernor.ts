// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import { ethers } from "hardhat";

async function main() {
    // Affiche l'adresse du compte qui déploie le contrat
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Déployer le token
    const token = await ethers.deployContract("CoproToken", [deployer.address], {});
    
    await token.waitForDeployment();

    console.log(
        `Contract Token deployed to ${token.target}, adress owner is ${deployer.address}`
    );

    // Déployer le contrat governor
    const governor = await ethers.deployContract("CoproGovernor", [await token.getAddress()], {});

    await governor.waitForDeployment();

    console.log(
        `Governor deployed to ${governor.target}, adress owner is ${deployer.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});