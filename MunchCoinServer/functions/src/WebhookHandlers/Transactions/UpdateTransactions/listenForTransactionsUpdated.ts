import createTransactions from "./createTransactions";

const listenForTransactionsUpdated = async (message: any) => {
  const dataString = Buffer.from(message.data, "base64").toString();
  const { data } = JSON.parse(dataString);
  await createTransactions(data);

  return Promise.resolve();
};

export default listenForTransactionsUpdated;
