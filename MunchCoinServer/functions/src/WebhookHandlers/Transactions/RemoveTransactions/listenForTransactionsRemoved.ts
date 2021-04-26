import removeTransactions from "./removeTransactions";

const listenForTransactionsRemoved = async (message: any) => {
  const dataString = Buffer.from(message.data, "base64").toString();
  const { data } = JSON.parse(dataString);

  await removeTransactions(data.transaction_ids, data.userID);

  return Promise.resolve();
};

export default listenForTransactionsRemoved;
