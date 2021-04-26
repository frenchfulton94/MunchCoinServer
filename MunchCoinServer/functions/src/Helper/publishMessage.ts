import { PubSub } from "@google-cloud/pubsub";
import { WebhookPubSubMessage } from "./Models";

const pubSubClient = new PubSub();

const publishMessage = async (params: WebhookPubSubMessage) => {
  const { topic, payload } = params;

  try {
    const messageObject = JSON.stringify({ data: payload });
    const buffer = Buffer.from(messageObject, "utf8");

    await pubSubClient.topic(topic).publish(buffer);

    return;
  } catch (error) {
    console.error(error);
    console.log("this was called");
  }
};

export default publishMessage;
