import { firestore } from "firebase-admin/lib/firestore";
import { FirestoreReferences, StoredTransaction } from "../../../Helper/Models";

const updateEateryHistoryForUser = async (
  transactions: StoredTransaction[],
  userID: string
): Promise<void> => {
  const verifiedTransactions = transactions.filter(
    (transaction) => transaction.isVerified
  );

  const firestoreSetOptions = {
    mergeFields: ["munchEarned", "dollarSpent", "visits"],
  };
  let historyData: any;

  const updateRequests = verifiedTransactions.map((transaction) => {
    historyData = {
      eateryID: transaction.eateryID,
      munchEarned: firestore.FieldValue.increment(transaction.munchCoinAmount),
      munchSpent: 0,
      dollarsSpent: firestore.FieldValue.increment(transaction.dollarAmount),
      visits: firestore.FieldValue.increment(1),
      orders: 0,
      favorite: false,
      endorsements: [],
    };

    return FirestoreReferences.USER_HISTORY_ITEM(
      userID,
      transaction.eateryID!
    ).set(historyData, firestoreSetOptions);
  });

  await Promise.allSettled(updateRequests);
};

export default updateEateryHistoryForUser;
