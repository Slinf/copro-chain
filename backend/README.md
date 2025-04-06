# Copro-Chain - Backend 

## Description

Copro-Chain est une solution décentralisée basée sur la blockchain pour gérer les actifs des copropriétés.
Elle utilise Ethereum et des smart contracts pour assurer transparence et sécurité.


## Fonctionnalités

- Ajout de participant par owner (mint + delegate)
- Ajout de proposition
- Vote pour/contre les propositions
- Execution propositions

## Prérequis

- 22.9.0 or 20.13.1
- npm ou Yarn
- MetaMask pour les interactions blockchain
- Open Zeppelin

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Slinf/copro-chain.git
    ```
2. Installez les dépendances :

   ```bash
   npm install
    ```
3. Configurez les variables d’environnement dans .env.


4. Lancez node with :
 ```bash
 npx hardhat node 
 ```

5. Deploy contracts 
```bash
npx hardhat run .\scripts\deployGovernor.ts --network networkname
```