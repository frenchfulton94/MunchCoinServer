import {
  CreateTransactionItemsParams,
  Transaction,
  TransactionLocation,
  TransactionStatus,
  TransactionType,
  GetPlaidTransactionsParams,
  FirestoreReferences,
} from "../../../Helper/Models";
import plaid from "../../../config/PlaidConfig";

const convertDate = (date: Date): string => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return `${year}-${month < 10 ? `0${month}` : month}-${
    day > 9 ? day : `0${day}`
  }`;
};

const getPlaidTransactions = async (
  params: GetPlaidTransactionsParams
): Promise<any[]> => {
  const { plaidInfo, newTransactions, isInitial } = params;

  const { accessToken, startDate } = plaidInfo;

  if (isInitial) startDate.setDate(startDate.getDate() - 30);

  const endDate = convertDate(new Date());
  const startDateFormatted = convertDate(startDate);
  console.log(accessToken, startDateFormatted, endDate, newTransactions);
  try {
    const { transactions } = await plaid.getTransactions(
      accessToken,
      startDateFormatted,
      endDate,
      { count: newTransactions || 100 }
    );
    return transactions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const convertDollarToMunchCoin = (
  dollarAmount: number,
  isParticipatingEatery: boolean
): number =>
  Math.ceil(isParticipatingEatery ? dollarAmount : dollarAmount * 0.5);

const isParticipatingEatery = async (name: string): Promise<string | null> => {
  try {
    const querySnapshot = await FirestoreReferences.EATERIES.where(
      "plaidName",
      "==",
      name
    ).get();

    if (querySnapshot.empty) return null;

    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createTransaction = async (
  plaidTransaction: any
): Promise<Transaction> => {
  const {
    amount,
    location,
    name,
    authorized_date,
    date,
    merchant_name,
    transaction_id,
    payment_channel,
    pending,
    pending_transaction_id,
  } = plaidTransaction;

  const { address, city, postal_code, region, country, lat, lon } = location; // eslint-disable-line camelcase

  const transactionLocation: TransactionLocation = {
    address,
    city,
    region,
    country,
    zipCode: postal_code, // eslint-disable-line camelcase
    latitude: lat,
    longitude: lon,
  };

  const eateryName = merchant_name ?? name; // eslint-disable-line camelcase
  const status = pending
    ? TransactionStatus.PLAID_PENDING
    : TransactionStatus.ETHEREUM_PENDING;

  try {
    const eateryID = await isParticipatingEatery(eateryName);

    const munchAmount = convertDollarToMunchCoin(amount, eateryID !== null);

    return {
      status,
      eateryID,
      eateryName,
      date: authorized_date ?? date, // eslint-disable-line camelcase
      dollarAmount: amount,
      munchCoinAmount: munchAmount,
      type: TransactionType.REWARD,
      plaidTransactionID: transaction_id, // eslint-disable-line camelcase
      plaidTransactionType: payment_channel, // eslint-disable-line camelcase
      location: transactionLocation,
      isVerified: eateryID !== null,
      plaidPendingTransactionID: pending_transaction_id, // eslint-disable-line camelcase
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createTransactions = async (
  plaidTransactions: any[]
): Promise<Transaction[]> => {
  const createTransactionRequests = plaidTransactions.map(createTransaction);
  const transactionResponses = await Promise.allSettled(
    createTransactionRequests
  );
  const successfulResponses = transactionResponses.filter(
    (response) => response.status === "fulfilled"
  );

  return successfulResponses.map(
    (response) => (response as PromiseFulfilledResult<Transaction>).value
  );
};

const isValidCategory = (category: string): boolean => {
  const id = Number(category);

  switch (true) {
    case id >= 13001000 && id < 13004000:
    case id >= 13005000 && id < 14000000:
    case id >= 19025000 && id < 19026000:
      return true;
    default:
      return false;
  }
};

const validateTransaction = (plaidTransaction: any): boolean =>
  isValidCategory(plaidTransaction.category_id);

const getValidTransactions = (plaidTransactions: any[]): any[] =>
  plaidTransactions.filter(validateTransaction);

const createTransactionItems = async (
  params: CreateTransactionItemsParams
): Promise<Transaction[]> => {
  const { plaidInfo, newTransactions, isInitial } = params;

  try {
    const plaidTransactions = await getPlaidTransactions({
      plaidInfo,
      newTransactions,
      isInitial,
    });
    const validTransactions = getValidTransactions(plaidTransactions);

    return await createTransactions(validTransactions);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createTransactionItems;
