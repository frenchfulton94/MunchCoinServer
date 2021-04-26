import updateItemStatus from "./updateItemStatus";

const listenForItemUpdate = async (message: any) => {
  const dataString = Buffer.from(message.data, "base64").toString();
  const { data } = JSON.parse(dataString);

  await updateItemStatus(data.item_id, data.userID);

  return Promise.resolve();
};

export default listenForItemUpdate;
