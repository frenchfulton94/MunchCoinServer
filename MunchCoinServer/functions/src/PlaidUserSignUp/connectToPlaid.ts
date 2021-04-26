import { PlaidUserData, FirestoreReferences } from "../Helper/Models";
import plaid from "../config/PlaidConfig";
import { extractToken, verifyRequests } from "../Helper/requestValidation";

const validateRequestBody = (req: any): { publicToken: string } => {
  if (!req.body) throw new Error("No Request Body Sent.");

  const { publicToken } = req.body;

  if (!publicToken)
    throw new Error("Valid properties were not included, public_token");

  if (typeof publicToken !== "string")
    throw new TypeError("Properties must be of type string");

  return { publicToken };
};

const storePlaidData = (plaidData: PlaidUserData) => {
  const { accessToken, userID, itemID } = plaidData;

  return FirestoreReferences.USER_PLAID_ITEM(userID, itemID).set({
    accessToken,
    itemID,
    startDate: new Date(),
    updateRequired: false,
  });
};

const connectToPlaid = async (req: any, res: any) => {
  try {
    const idToken = extractToken(req);
    const decodeIDToken = await verifyRequests(idToken);
    const userID = decodeIDToken.uid;

    if (req.method !== "POST")
      return res.status(405).send({ error: "Invalid request" });

    const { publicToken } = validateRequestBody(req);

    const tokenResponse = await plaid.exchangePublicToken(publicToken);

    const plaidData: PlaidUserData = {
      userID,
      accessToken: tokenResponse.access_token,
      itemID: tokenResponse.item_id,
    };

    await storePlaidData(plaidData);

    return res.status(201).end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export default connectToPlaid;
