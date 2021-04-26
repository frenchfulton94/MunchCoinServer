import { ethers } from "ethers";
import { FirestoreReferences } from "../../Helper/Models";

interface User {
  email: string;
  notificationToken?: string;
  uid: string;
  username: string;
}
const user: User = {
  email: "bigcityguy212@gmail.com",
  uid: "bR7iz0YZ7GDG5XBSFzAjSI0jhcmJ",
  username: "TEST",
};

const createUser = async (req: any, res: any) => {
  try {
    await FirestoreReferences.USER(user.uid).set(user);
    const { address, mnemonic } = ethers.Wallet.createRandom();
    await FirestoreReferences.USER_WALLET(user.uid, address).set({
      address,
      default: true,
      name: "Wallet1",
      path: mnemonic.path,
    });

    res.end();
  } catch (error) {
    res.send(error.message);
  }
};

export default createUser;
