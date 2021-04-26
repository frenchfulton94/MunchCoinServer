import { messaging } from "firebase-admin/lib/messaging";
import * as firebaseConfig from "../config/FirebaseConfig";

const sendNotification = async (
  message: messaging.MessagingPayload,
  token: string
) => {
  await firebaseConfig.messaging.sendToDevice(
    token,
    {
      ...message,
    },
    {
      priority: "high",
      contentAvailable: true,
    }
  );
};

export default sendNotification;
