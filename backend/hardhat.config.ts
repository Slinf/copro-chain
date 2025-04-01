import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-docgen";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,  // Active l'optimisation
        runs: 200,      // Nombre d'exécutions pour optimiser les fonctions
      },
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  }
};

export default config;
