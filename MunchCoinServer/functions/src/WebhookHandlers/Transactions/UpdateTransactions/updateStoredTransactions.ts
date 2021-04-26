import {
  TransactionStatus,
  UpdateStoredTransactionsParams,
} from "../../../Helper/Models";

const updateStoredTransactions = async (
  params: UpdateStoredTransactionsParams
) => {
  const { transactionReceipt, transactions, walletAddress } = params;

  const { from, status, transactionHash } = transactionReceipt;

  const updateRequests = transactions.map((transaction) =>
    transaction.ref.update({
      transactionHash,
      sender: from,
      receiver: walletAddress,
      status:
        status === 1
          ? TransactionStatus.COMPLETE
          : TransactionStatus.ETHEREUM_FAILED,
    })
  );

  await Promise.allSettled(updateRequests);
};

export default updateStoredTransactions;
