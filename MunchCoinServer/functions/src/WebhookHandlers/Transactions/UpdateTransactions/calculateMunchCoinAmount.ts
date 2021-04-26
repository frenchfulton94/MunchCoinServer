import { Transaction } from "../../../Helper/Models";

const calculateMunchCoinAmount = (transactions: Transaction[]): number =>
  transactions.reduce(
    (previousValue, currentTransaction) =>
      previousValue + currentTransaction.munchCoinAmount,
    0
  );

export default calculateMunchCoinAmount;
