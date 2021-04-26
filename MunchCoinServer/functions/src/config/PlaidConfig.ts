import { Client, environments } from "plaid";

const client = new Client({
  clientID: process.env.PLAID_CLIENT_ID as string,
  secret: process.env.PLAID_SECRET_SANDBOX as string,
  env: environments.sandbox,
  options: {
    version: "2020-09-14",
  },
});

export default client;
