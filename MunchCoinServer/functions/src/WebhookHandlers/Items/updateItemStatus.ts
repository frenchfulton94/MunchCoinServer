import { FirestoreReferences } from "../../Helper/Models";

const updateItemStatus = async (itemID: string, userID: string) => {
  try {
    await FirestoreReferences.USER_PLAID_ITEM(userID, itemID).update({
      updateRequired: true,
    });

    return;
  } catch (error) {
    console.error(error);
  }
};

export default updateItemStatus;
