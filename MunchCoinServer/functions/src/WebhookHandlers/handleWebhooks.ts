import handleItemWebhook from "./Items/itemHandler";
import handleTransactionWebhook from "./Transactions/transactionHandler";
// import isValidWebhook from "../Helper/isValidWebhook";

const handleWebhooks = async (req: any, res: any) => {
  try {
    const jwt = req.headers["plaid-verification"];

    if (!jwt) return res.end();

    // await isValidWebhook(jwt);

    const { userID } = req.query;
    const webhookData: any = req.body;
    const webhookType: string = webhookData.webhook_type;

    console.log(userID);

    switch (webhookType) {
      case "TRANSACTIONS":
        await handleTransactionWebhook(webhookData, userID);
        break;
      case "ITEM":
        await handleItemWebhook(webhookData, userID);
        break;
      default:
        break;
    }

    return res.end();
  } catch (error) {
    console.error(error);
    return res.end();
  }
};

export default handleWebhooks;
