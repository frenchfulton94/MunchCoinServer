import * as firebase from "firebase-admin";
import { auth } from "../config/FirebaseConfig";

export const extractToken = (req: any): string => {
  if (!req.headers.authorization)
    throw new Error("No valid request authorization was sent.");

  if (typeof req.headers.authorization !== "string")
    throw new TypeError("Token needs to be a string.");

  const authorizationComponents: string[] = req.headers.authorization.split(
    " "
  );

  if (authorizationComponents.length < 2)
    throw new Error("Invalid authorization format.");

  return authorizationComponents[1];
};

export const verifyRequests = async (
  token: string
): Promise<firebase.auth.DecodedIdToken> => auth.verifyIdToken(token);
