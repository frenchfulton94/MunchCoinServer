import { FirestoreReferences } from "./Models";

const getNotificationToken = async (userID: string): Promise<string | null> => {
  const response = await FirestoreReferences.USER(userID).get();

  if (!response.exists) return null;

  return response.data()!.notificationToken;
};

export default getNotificationToken;
