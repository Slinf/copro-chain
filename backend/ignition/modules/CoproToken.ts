// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

 const SYNDIC_ADRESS = 0x0000;
 const OWNERS = [
  
 ];
 const TANTIEMES: bigint = 1_000_000_000n;

const CoproTokenModule = buildModule("CoproTokenModule", (m) => {
   const syndicAdress = m.getParameter("_syndic", SYNDIC_ADRESS);
   const owners = m.getParameter("proprietaires", OWNERS);
   const tantiemes = m.getParameter("tantiemes", TANTIEMES);

  const coproToken = m.contract("Lock", [syndicAdress, owners, tantiemes ], {});

  return { coproToken };
});

export default CoproTokenModule;
