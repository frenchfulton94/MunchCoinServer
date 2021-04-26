import plaid from "../config/PlaidConfig";

const getTransactions = async (req: any, res: any) => {
  const { startDate, endDate, count } = req.query;

  try {
    const response = await plaid.getTransactions(
      req.query.access_token,
      startDate,
      endDate,
      { count: Number(count) }
    );
    return res.json({ transactions: response.transactions });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

export default getTransactions;
