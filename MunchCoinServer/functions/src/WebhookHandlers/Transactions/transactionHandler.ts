import { WebhookPubSubTopics, WebhookPubSubMessage } from "../../Helper/Models";
import publishMessage from "../../Helper/publishMessage";

const handleTransactionWebhook = async (webhookData: any, userID: string) => {
  let message: WebhookPubSubMessage;

  switch (webhookData.webhook_code) {
    case "INITIAL_UPDATE":
    case "DEFAULT_UPDATE":
      message = {
        topic: WebhookPubSubTopics.WEBHOOK_TRANSACTIONS_UPDATE,
        payload: { ...webhookData, userID },
      };
      break;
    case "TRANSACTIONS_REMOVED":
      message = {
        topic: WebhookPubSubTopics.WEBHOOK_TRANSACTIONS_REMOVE,
        payload: { ...webhookData, userID },
      };

      break;
    default:
      return;
  }

  await publishMessage(message);
};

export default handleTransactionWebhook;
