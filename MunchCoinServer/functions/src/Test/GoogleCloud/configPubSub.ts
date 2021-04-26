import { PubSub } from "@google-cloud/pubsub";
import {
  WebhookPubSubTopics,
  WebhookPubSubSubscriptions,
} from "../../Helper/Models";

const pubSubClient = new PubSub();

const configPubSub = async (req: any, res: any) => {
  try {
    const topicNames = [
      WebhookPubSubTopics.WEBHOOK_ITEMS_UPDATE,
      WebhookPubSubTopics.WEBHOOK_ITEMS_REMOVE,
      WebhookPubSubTopics.WEBHOOK_TRANSACTIONS_REMOVE,
      WebhookPubSubTopics.WEBHOOK_TRANSACTIONS_UPDATE,
    ];

    const subscriptionNames = [
      WebhookPubSubSubscriptions.CLOUD_FUNCTIONS_ITEMS_UPDATE,
      WebhookPubSubSubscriptions.CLOUD_FUNCTIONS_ITEMS_REMOVE,
      WebhookPubSubSubscriptions.CLOUD_FUNCTIONS_TRANSACTIONS_REMOVE,
      WebhookPubSubSubscriptions.CLOUD_FUNCTIONS_TRANSACTIONS_UPDATE,
    ];
    const topicRequests = topicNames.map((topicName) =>
      pubSubClient.createTopic(topicName)
    );
    const topics = await Promise.all(topicRequests);

    const subscriptionRequests = topics.map(([topic], index) =>
      topic.createSubscription(subscriptionNames[index])
    );

    await Promise.all(subscriptionRequests);

    res.end();
  } catch (error) {
    res.send(error.message);
  }
};

export default configPubSub;
