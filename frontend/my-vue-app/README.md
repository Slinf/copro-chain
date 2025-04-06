# my-vue-app/coprochain

Developed with Vue 3 in Vite.


## Context / Contexte 

Framework: Vue.js  & TypeScript
Librairie de composants : Shadcn for vue 
Connexion wallet : AppKit de Reown 
Interactions avec smart contract :
Viem pour decodeEventLog
Wagmi pour read & write contract, Network config
getPublicClient, Create Config, 

L’application est composés de différentes pages: 

Page Gouvernance
où l’on retrouve la liste des propositions en actives / passées.
accès aux détails d’une proposition avec possibilité de vote / exécution;
Page Token:
présentant les informations concernant le token (répartition / total supply ..etc)
Page Administration :
dédiée au gestionnaire de la copro ou personne responsable pour ajouter des participants à la DAO 

-----------------------------------

Framework: Vue.js & TypeScript
Component library : Shadcn for vue 
Wallet connection: Reown AppKit 
Interaction with smart contract :
Viem for decodeEventLog
Wagmi for read & write contract, Network config
getPublicClient, Create Config, 

The application is made up of different pages: 

Governance page
where you will find the list of active / past proposals.
Access to the details of a proposal with the option of voting/execution;
Token page:
presenting information about the token (distribution / total supply ..etc)
Administration page :
dedicated to the copro manager or person responsible for adding participants to the DAO 

Translated with DeepL.com (free version)


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
