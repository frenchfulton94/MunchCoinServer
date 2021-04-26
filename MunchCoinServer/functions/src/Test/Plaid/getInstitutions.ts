import plaid from "../../config/PlaidConfig";

const getInstitutions = async (req: any, res: any) => {
  try {
    const response = await plaid.getInstitutions(100, 0, ["US"]);
    return res.send({ ...response });
  } catch (error) {
    return res.send(error.message);
  }
};

export default getInstitutions;
