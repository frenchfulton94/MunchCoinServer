import plaid from "../config/PlaidConfig";

const getCategories = async (req: any, res: any): Promise<any> => {
  try {
    const { categories } = await plaid.getCategories();
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};

export default getCategories;
