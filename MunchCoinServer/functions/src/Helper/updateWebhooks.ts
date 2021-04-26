import plaid from "../config/PlaidConfig";

interface UserItem {
  accessToken: string;
  userID: string;
}

const updateWebhooks = async (req: any, res: any) => {
  const { items, url } = req.body;
  try {
    const webhookUpdateRequests = items.map((item: UserItem) =>
      plaid.updateItemWebhook(item.accessToken, `${url}${item.userID}`)
    );

    const responses = await Promise.allSettled(webhookUpdateRequests);
    return res.send({ ...responses });
  } catch (error) {
    return res.send(error.message);
  }
};

export default updateWebhooks;
