import { FirestoreReferences, UserPlaidInfo } from "../../../Helper/Models";

const getPlaidInfo = async (
  userID: string,
  itemID: string
): Promise<UserPlaidInfo | Error> => {
  try {
    console.log(userID, itemID);
    const doc = await FirestoreReferences.USER_PLAID_ITEM(userID, itemID).get();
    let results: UserPlaidInfo | Error;
    if (doc.exists) {
      const { accessToken, startDate } = doc.data()!;
      results = { accessToken, startDate: startDate.toDate() };
    } else {
      const error = new Error("doc does not exist");
      console.error(error);
      results = error;
    }

    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getPlaidInfo;
