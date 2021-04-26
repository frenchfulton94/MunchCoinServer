import { WebhookPubSubMessage, WebhookPubSubTopics } from "../../Helper/Models";
import publishMessage from "../../Helper/publishMessage";

const handleItemWebhook = async (webhookData: any, userID: string) => {
  let message: WebhookPubSubMessage;

  switch (webhookData.webhook_code) {
    case "ERROR":
    case "PENDING_EXPIRATION":
      message = {
        topic: WebhookPubSubTopics.WEBHOOK_ITEMS_UPDATE,
        payload: { ...webhookData, userID },
      };
      break;
    case "USER_PERMISSION_REVOKED":
      message = {
        topic: WebhookPubSubTopics.WEBHOOK_ITEMS_REMOVE,
        payload: { ...webhookData, userID },
      };
      break;
    default:
      return;
  }

  await publishMessage(message);
};

export default handleItemWebhook;
