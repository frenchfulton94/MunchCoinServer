import * as JWT from "jsonwebtoken";
import plaid from "../config/PlaidConfig";

const isValidWebHook = async (jwt: any) => {
  const token = JWT.decode(jwt, { complete: true });

  if (!token || token.header.alg !== "ES256") return false;
  try {
    const response = await plaid.getWebhookVerificationKey(token.header.kid);

    const { key } = response;
    console.log(key);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default isValidWebHook;
