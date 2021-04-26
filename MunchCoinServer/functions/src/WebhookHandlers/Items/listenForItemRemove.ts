import handleItemRevoked from "./handleItemRevoked";

const listenForItemRemoved = async (message: any) => {
  const dataString = Buffer.from(message.data, "base64").toString();
  const { data } = JSON.parse(dataString);

  await handleItemRevoked(data.item_id, data.userID);

  return Promise.resolve();
};

export default listenForItemRemoved;
