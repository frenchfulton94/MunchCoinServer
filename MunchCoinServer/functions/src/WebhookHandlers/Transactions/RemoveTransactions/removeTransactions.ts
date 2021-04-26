import { firestore } from "firebase-admin/lib/firestore";
import { FirestoreReferences } from "../../../Helper/Models";

const getTransactionRefs = async (
  transactionIDs: string[],
  userID: string
): Promise<firestore.DocumentReference[]> => {
  const mapRefs = (snapshot: firestore.QuerySnapshot) =>
    snapshot.docs.map((document) => document.ref);

  const requests = [];
  let offset = 0;

  while (offset < transactionIDs.length) {
    requests.push(
      FirestoreReferences.USER_TRANSACTIONS(userID)
        .where(
          "plaidTransactionID",
          "in",
          transactionIDs.slice(offset, offset + 10)
        )
        .get()
        .then(mapRefs)
    );

    offset += 10;
  }

  const refGroupsResults = await Promise.allSettled(requests);

  const successfulRefGroups: firestore.DocumentReference[][] = refGroupsResults
    .filter((result) => result.status === "fulfilled")
    .map(
      (result) =>
        (result as PromiseFulfilledResult<firestore.DocumentReference[]>).value
    );

  return successfulRefGroups.flat();
};

const deleteTransactions = async (
  transactionRefs: firestore.DocumentReference[]
) => {
  const requests = transactionRefs.map((ref) => ref.delete());
  await Promise.allSettled(requests);
};

// TODO: improve error handling
const removeTransactions = async (transactionIDs: string[], userID: string) => {
  const transactionRefs = await getTransactionRefs(transactionIDs, userID);
  await deleteTransactions(transactionRefs);
};

export default removeTransactions;
