import { ethers } from "ethers";
import ContractInfo from "./ContractInfo";

export const provider = new ethers.providers.InfuraProvider(
  "goerli",
  process.env.INFURA_API_KEY
);
export const signer = ethers.Wallet.fromMnemonic(
  ContractInfo.mnemonic!
).connect(provider);

export const contract = new ethers.Contract(
  ContractInfo.address,
  ContractInfo.ABI,
  signer
);
