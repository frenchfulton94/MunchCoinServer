import { FirestoreReferences } from "../Helper/Models";
import plaid from "../config/PlaidConfig";
import { extractToken, verifyRequests } from "../Helper/requestValidation";

const getAccessToken = async (userID: string): Promise<string | null> => {
  try {
    const querySnapshot = await FirestoreReferences.USER_PLAID_ITEMS(userID)
      .where("updateRequired", "==", true)
      .get();

    if (querySnapshot.empty) return null;

    return querySnapshot.docs[0].data().accessToken;
  } catch (error) {
    return null;
  }
};

const configureLinkTokenOptions = async (userID: string): Promise<any> => {
  /* eslint-disable camelcase */
  const configOptions: any = {
    user: {
      client_user_id: userID, // eslint-disable-line camelcase
    },
    client_name: "MunchCoin App", // eslint-disable-line camelcase
    products: ["transactions"],
    country_codes: ["US"], // eslint-disable-line camelcase
    language: "en",
    webhook: `https://us-east1-munchcoinapp.cloudfunctions.net/handleWebhooksDev?userID=${userID}`,
    account_filters: {
      depository: {
        account_subtypes: ["checking", "paypal", "prepaid"], // eslint-disable-line camelcase
      },
      credit: {
        account_subtypes: ["credit card", "paypal"], // eslint-disable-line camelcase
      },
    },
  };

  const accessToken = await getAccessToken(userID);

  if (accessToken) configOptions.access_token = accessToken; // eslint-disable-line camelcase

  return configOptions;
};

const getLinkToken = async (req: any, res: any): Promise<any> => {
  try {
    const idToken = extractToken(req);
    const decodedIDToken = await verifyRequests(idToken);
    const userID = decodedIDToken.uid;

    if (req.method !== "GET")
      return res.status(405).send({ error: "Invalid request" });

    const linkTokenOptions = await configureLinkTokenOptions(userID);
    const response = await plaid.createLinkToken(linkTokenOptions);

    return res.json({ token: response.link_token });
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};

export default getLinkToken;
