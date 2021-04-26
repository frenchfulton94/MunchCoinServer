import dotenv = require("dotenv");
/* eslint-disable import/first */
// import { PubSub } from "@google-cloud/pubsub";
// import { WebhookPubSubSubscriptions } from "./Helper/Models";

dotenv.config({ path: `${__dirname}/config/.env` });

// if (
//   process.env.npm_lifecycle_script ===
//   "functions-framework --target=listenForTransactionsUpdated --port=9033 --signature-type=event"
// ) {
//   const pubSubClient = new PubSub();
//   const sub = pubSubClient.subscription(
//     WebhookPubSubSubscriptions.CLOUD_FUNCTIONS_TRANSACTIONS_UPDATE
//   );
//
//   sub.on("message", async (message: any) => {
//     const func = await import(
//       "./WebhookHandlers/Transactions/UpdateTransactions/listenForTransactionsUpdated"
//     );
//     await func.default(message);
//   });
// }

exports.listenForTransactionsRemoved = async (message: any) => {
  const func = await import(
    "./WebhookHandlers/Transactions/RemoveTransactions/listenForTransactionsRemoved"
  );
  await func.default(message);
};

exports.listenForTransactionsUpdated = async (message: any) => {
  const func = await import(
    "./WebhookHandlers/Transactions/UpdateTransactions/listenForTransactionsUpdated"
  );
  await func.default(message);
};

exports.listenForItemRemoved = async (message: any) => {
  const func = await import("./WebhookHandlers/Items/listenForItemRemove");
  await func.default(message);
};

exports.listenForItemUpdate = async (message: any) => {
  const func = await import("./WebhookHandlers/Items/itemUpdateSubscriber");
  await func.default(message);
};

exports.getLinkToken = async (req: any, res: any) => {
  const func = await import("./PlaidUserSignUp/getLinkToken");
  await func.default(req, res);
};

exports.connectToPlaid = async (req: any, res: any) => {
  const func = await import("./PlaidUserSignUp/connectToPlaid");
  await func.default(req, res);
};

exports.handleTransactions = async (req: any, res: any) => {
  const func = await import("./WebhookHandlers/handleWebhooks");
  await func.default(req, res);
};

exports.getCategories = async (req: any, res: any) => {
  const func = await import("./Helper/getCategories");
  await func.default(req, res);
};

exports.getBalance = async (req: any, res: any) => {
  const func = await import("./Helper/getBalance");
  await func.default(req, res);
};

exports.getTransactions = async (req: any, res: any) => {
  const func = await import("./Helper/getTransactions");
  await func.default(req, res);
};

exports.getCoordinates = async (req: any, res: any) => {
  const func = await import("./Helper/getCoordinates");
  await func.default(req, res);
};

exports.checkUser = async (req: any, res: any) => {
  const func = await import("./Helper/checkUser");
  await func.default(req, res);
};

exports.createPublicToken = async (req: any, res: any) => {
  const func = await import("./Test/Plaid/Sandbox/createPublicToken");
  await func.default(req, res);
};

exports.simulateWebhook = async (req: any, res: any) => {
  const func = await import("./Test/Plaid/Sandbox/simulateWebhook");
  await func.default(req, res);
};

exports.resetLogin = async (req: any, res: any) => {
  const func = await import("./Test/Plaid/Sandbox/resetLogin");
  await func.default(req, res);
};

exports.getInstitutions = async (req: any, res: any) => {
  const func = await import("./Test/Plaid/getInstitutions");
  await func.default(req, res);
};

exports.createUser = async (req: any, res: any) => {
  const func = await import("./Test/Firebase/createUser");
  await func.default(req, res);
};

exports.handleWebhooks = async (req: any, res: any) => {
  const func = await import("./WebhookHandlers/handleWebhooks");
  await func.default(req, res);
};

exports.updateWebhooks = async (req: any, res: any) => {
  const func = await import("./Helper/updateWebhooks");
  await func.default(req, res);
};

exports.configPubSub = async (req: any, res: any) => {
  const func = await import("./Test/GoogleCloud/configPubSub");
  await func.default(req, res);
};
