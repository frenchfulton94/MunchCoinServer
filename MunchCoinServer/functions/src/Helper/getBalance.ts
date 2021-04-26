import { ethers } from "ethers";
import { contract } from "../config/EthersConfig";
import { extractToken, verifyRequests } from "./requestValidation";

const isWalletAddress = (walletAddress: any): boolean => {
  // TODO: Check if isAddress argument is typed
  if (
    !walletAddress ||
    typeof walletAddress !== "string" ||
    !ethers.utils.isAddress(walletAddress)
  )
    throw new Error("Not a valid wallet address.");

  return true;
};

const getBalance = async (req: any, res: any) => {
  try {
    const idToken = extractToken(req);
    await verifyRequests(idToken);
    const { walletAddress } = req.query;
    isWalletAddress(walletAddress);
    const balanceBigNumber = await contract.balanceOf(walletAddress);
    const balance = balanceBigNumber.toString();
    return res.status(200).json({ walletAddress, balance });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

export default getBalance;
