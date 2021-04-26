import { FirestoreReferences, Wallet } from "../../../Helper/Models";

const getWallet = async (userID: string): Promise<Wallet | null> => {
  try {
    const walletDoc = await FirestoreReferences.USER_WALLETS(userID)
      .where("isDefault", "==", true)
      .get();

    if (walletDoc.empty) return null;
    const { address, isDefault, name, path } = walletDoc.docs[0].data();

    return {
      address,
      isDefault,
      name,
      path,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getWallet;
