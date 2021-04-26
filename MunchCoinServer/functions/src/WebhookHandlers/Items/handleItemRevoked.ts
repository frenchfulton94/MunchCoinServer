import { FirestoreReferences } from "../../Helper/Models";
import plaid from "../../config/PlaidConfig";

const getAccessToken = async (
  itemID: string,
  userID: string
): Promise<string | null> => {
  try {
    const doc = await FirestoreReferences.USER_PLAID_ITEM(userID, itemID).get();

    if (!doc.exists) return null;

    return doc.data()!.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteItemFromFirestore = async (itemID: string, userID: string) => {
  try {
    await FirestoreReferences.USER_PLAID_ITEM(userID, itemID).delete();

    return;
  } catch (error) {
    console.error(error);
  }
};

const deleteItemFromPlaid = async (accessToken: string) => {
  try {
    await plaid.removeItem(accessToken);
    return;
  } catch (error) {
    console.error(error);
  }
};

const handleItemRevoked = async (itemID: string, userID: string) => {
  const accessToken = await getAccessToken(itemID, userID);

  if (!accessToken) return;

  await deleteItemFromFirestore(itemID, userID);
  await deleteItemFromPlaid(accessToken);
};

export default handleItemRevoked;
