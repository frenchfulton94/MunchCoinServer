import { firestore } from "firebase-admin/lib/firestore";
import * as firestoreConfig from "../config/FirebaseConfig";

export enum WebhookPubSubTopics {
  WEBHOOK_TRANSACTIONS_REMOVE = "webhook_transactions_remove",
  WEBHOOK_TRANSACTIONS_UPDATE = "webhook_transactions_update",
  WEBHOOK_ITEMS_UPDATE = "webhook_items_update",
  WEBHOOK_ITEMS_REMOVE = "webhook_items_remove",
}

export enum WebhookPubSubSubscriptions {
  CLOUD_FUNCTIONS_TRANSACTIONS_UPDATE = "cloud_functions_transactions_update",
  CLOUD_FUNCTIONS_TRANSACTIONS_REMOVE = "cloud_functions_transactions_remove",
  CLOUD_FUNCTIONS_ITEMS_UPDATE = "cloud_functions_items_update",
  CLOUD_FUNCTIONS_ITEMS_REMOVE = "cloud_functions_items_remove",
}

export enum TransactionStatus {
  PLAID_PENDING = "plaid_pending",
  ETHEREUM_PENDING = "ethereum_pending",
  ETHEREUM_FAILED = "ethereum_failed",
  COMPLETE = "complete",
}

export enum CloudFunctionPaths {
  GET_LINK_TOKEN = "./PlaidUserSignUp/getLinkToken",
  CONNECT_TO_PLAID = "./PlaidUserSignUp/connectToPlaid",
  HANDLE_TRANSACTIONS = "./WebhookHandlers/handleWebhooks",
  GET_CATEGORIES = "./Helper/getCategories",
  GET_BALANCE = "./Helper/getBalance",
  GET_TRANSACTIONS = "./Helper/getTransactions",
  GET_COORDINATES = "./Helper/getCoordinates",
  CHECK_USER = "./Helper/checkUser",
}

export enum TransactionType {
  REWARD = "reward",
}

export interface WebhookPubSubMessage {
  payload: any;
  topic: WebhookPubSubTopics;
}

export interface UserPlaidInfo {
  accessToken: string;
  startDate: Date;
}

export interface CreateTransactionItemsParams {
  plaidInfo: UserPlaidInfo;
  newTransactions: number;
  isInitial: boolean;
}

export interface GetPlaidTransactionsParams {
  plaidInfo: UserPlaidInfo;
  newTransactions: number;
  isInitial: boolean;
}

export interface PlaidUserData {
  accessToken: string;
  itemID: string;
  userID: string;
}

export interface TransactionLocation {
  address: string | null;
  city: string | null;
  region: string | null;
  zipCode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Wallet {
  address: string;
  isDefault: boolean;
  path: string;
  name: string;
}

export interface AddressComponents {
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  region?: string | null;
}

export interface Transaction {
  status: TransactionStatus;
  eateryID: string | null;
  eateryName: string;
  date: string;
  dollarAmount: number;
  munchCoinAmount: number;
  type: TransactionType;
  plaidTransactionID: string;
  plaidTransactionType: string | null;
  location: TransactionLocation;
  isVerified: boolean;
  plaidPendingTransactionID: string | null;
}

export interface StoredTransaction extends Transaction {
  id: string;
  ref: firestore.DocumentReference;
  sender?: string;
  receiver?: string;
  ethereumTransactionHash?: string;
}

export interface UpdateStoredTransactionsParams {
  transactions: StoredTransaction[];
  walletAddress: string;
  transactionReceipt: any;
}

export class FirestoreReferences {
  static get EATERIES(): firestore.CollectionReference {
    return firestoreConfig.firestore.collection("Eateries");
  }

  static EATERY(eateryID: string): firestore.DocumentReference {
    return FirestoreReferences.EATERIES.doc(eateryID);
  }

  static USER_TRANSACTION(
    userID: string,
    transactionID: string
  ): firestore.DocumentReference {
    return FirestoreReferences.USER_TRANSACTIONS(userID).doc(transactionID);
  }

  static USER_TRANSACTIONS(userID: string): firestore.CollectionReference {
    return FirestoreReferences.USER(userID)
      .collection("Transactions")
      .doc("TransactionsData")
      .collection("Items");
  }

  static USER_WALLETS(userID: string): firestore.CollectionReference {
    return FirestoreReferences.USER(userID).collection("Wallets");
  }

  static USER_WALLET(
    userID: string,
    walletID: string
  ): firestore.DocumentReference {
    return FirestoreReferences.USER_WALLETS(userID).doc(walletID);
  }

  static USER_PLAID_ITEMS(userID: string): firestore.CollectionReference {
    return FirestoreReferences.USER(userID).collection("PlaidAccounts");
  }

  static USER_PLAID_ITEM(
    userID: string,
    itemID: string
  ): firestore.DocumentReference {
    return FirestoreReferences.USER_PLAID_ITEMS(userID).doc(itemID);
  }

  static USER(userID: string): firestore.DocumentReference {
    return firestoreConfig.firestore.collection("Users").doc(userID);
  }

  static USER_HISTORY_ITEMS(userID: string): firestore.CollectionReference {
    return FirestoreReferences.USER(userID).collection("History");
  }

  static USER_HISTORY_ITEM(
    userID: string,
    eateryID: string
  ): firestore.DocumentReference {
    return FirestoreReferences.USER_HISTORY_ITEMS(userID).doc(eateryID);
  }
}
