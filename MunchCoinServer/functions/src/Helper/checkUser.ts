import { auth } from "../config/FirebaseConfig";
import { extractToken, verifyRequests } from "./requestValidation";

const checkUser = async (req: any, res: any) => {
  try {
    const idToken = extractToken(req);
    const decodedIDToken = await verifyRequests(idToken);
    const userID = decodedIDToken.uid;
    await auth.getUser(userID);
    return res.json({ userExists: true });
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};

export default checkUser;
