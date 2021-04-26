import getPlaidInfo from "./getplaidInfo";
import createTransactionItems from "./createTransactionItems";
import storeTransactions from "./storeTransactions";
import calculateMunchcoinReward from "./calculateMunchCoinAmount";
import updateEateryHistoryForUser from "./updateUserEateryHistory";
import performRewardTransaction from "./performRewardTransaction";
import getDefaultWallet from "./getWallet";
import getNotificationToken from "../../../Helper/getNotificationToken";
import sendNotification from "../../../Helper/sendNotification";
import updateStoredTransactions from "./updateStoredTransactions";

const createTransactions = async (webhookData: any) => {
  const { item_id, userID, new_transactions, webhook_code } = webhookData;

  try {
    const plaidInfo = await getPlaidInfo(userID, item_id);

    if (plaidInfo instanceof Error) return;

    const transactions = await createTransactionItems({
      plaidInfo,
      newTransactions: new_transactions, // eslint-disable-line camelcase
      isInitial: webhook_code === "INITIAL_UPDATE", // eslint-disable-line camelcase
    }); // eslint-disable-line camelcase

    const rewardAmount = calculateMunchcoinReward(transactions);

    const storedTransactions = await storeTransactions(transactions, userID);

    updateEateryHistoryForUser(storedTransactions, userID);

    const wallet = await getDefaultWallet(userID);

    console.log(wallet, rewardAmount);

    if (!wallet) return;

    const transactionReceipt = await performRewardTransaction(
      wallet.address,
      rewardAmount
    );

    console.log(transactionReceipt);

    if (!transactionReceipt) return;

    if (rewardAmount > 0) {
      // TODO: maybe move this into separate background function
      const message = {
        notification: {
          title: "🥳 MunchCoin Rewards",
          body: `🎉 Yay! You've earned ${rewardAmount} $MNCH 🎉`,
        },
        data: {
          type: "Reward",
          message: `🎉 Yay! You've earned ${rewardAmount} $MNCH 🎉`,
        },
      };

      const notificationToken = await getNotificationToken(userID);
      if (notificationToken) await sendNotification(message, notificationToken);
    }

    console.log(storedTransactions);
    await updateStoredTransactions({
      transactionReceipt,
      walletAddress: wallet.address,
      transactions: storedTransactions,
    });

    return;
  } catch (error) {
    console.error(error);
  }
};

export default createTransactions;
