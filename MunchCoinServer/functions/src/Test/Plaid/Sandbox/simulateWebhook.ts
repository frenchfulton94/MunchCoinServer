import plaid from "../../../config/PlaidConfig";

const simulateWebhook = async (req: any, res: any) => {
  const { accessToken } = req.query;

  if (!accessToken || typeof accessToken !== "string")
    return res.status(400).end();

  try {
    await plaid.sandboxItemFireWebhook(accessToken, "DEFAULT_UPDATE");
    return res.end();
  } catch (error) {
    console.error(error);
    return res.send(error.message);
  }
};

export default simulateWebhook;
