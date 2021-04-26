import plaid from "../../../config/PlaidConfig";

const createPublicToken = async (req: any, res: any) => {
  const { institutionID } = req.query;

  try {
    const response = await plaid.sandboxPublicTokenCreate(institutionID, [
      "transactions",
    ]);

    return res.send({ ...response });
  } catch (error) {
    return res.send(error.message);
  }
};

export default createPublicToken;
