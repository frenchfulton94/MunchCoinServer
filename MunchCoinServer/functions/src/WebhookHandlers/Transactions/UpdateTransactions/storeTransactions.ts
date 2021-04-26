import { firestore } from "firebase-admin/lib/firestore";
import {
  Transaction,
  FirestoreReferences,
  StoredTransaction,
} from "../../../Helper/Models";

const storeTransactions = async (
  transactions: Transaction[],
  userID: string
): Promise<StoredTransaction[]> => {
  const transactionRefs: StoredTransaction[] = [];
  let transactionRef: firestore.DocumentReference;

  const storeTransactionRequests = transactions.map((transaction) => {
    transactionRef = FirestoreReferences.USER_TRANSACTIONS(userID).doc();

    transactionRefs.push({
      ...transaction,
      id: transactionRef.id,
      ref: transactionRef,
    });

    return transactionRef.set({ ...transaction, id: transactionRef.id });
  });

  await Promise.allSettled(storeTransactionRequests);

  return transactionRefs;
};

export default storeTransactions;
