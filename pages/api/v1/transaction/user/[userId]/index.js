import { createRouter } from "next-connect";
import controller from "infra/controller";
import transaction from "models/transaction.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  let transactions;
  const { userId, month, year } = request.query;

  if (month && year) {
    transactions = await transaction.getMonthExpenses(userId, month, year);
  } else {
    transactions = await transaction.findAllByUserId(userId);
  }

  return response.status(200).json(transactions);
}
