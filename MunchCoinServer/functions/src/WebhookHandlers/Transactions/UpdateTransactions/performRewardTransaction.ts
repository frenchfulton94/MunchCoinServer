import { contract } from "../../../config/EthersConfig";

const performRewardTransaction = async (
  walletAddress: string,
  amount: number
) => {
  try {
    const canTransfer = await contract.callStatic.transfer(
      walletAddress,
      amount
    );

    if (!canTransfer) return null;

    const transactionResponse = await contract.transfer(walletAddress, amount);
    return await transactionResponse.wait();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default performRewardTransaction;
