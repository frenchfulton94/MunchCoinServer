import plaid from "../../../config/PlaidConfig";

const resetLogin = async (req: any, res: any) => {
  const { accessToken } = req.body;

  try {
    const response = await plaid.resetLogin(accessToken);

    return res.send({ ...response });
  } catch (error) {
    return res.send({ error });
  }
};

export default resetLogin;
