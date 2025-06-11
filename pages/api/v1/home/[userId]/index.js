import { createRouter } from "next-connect";
import controller from "infra/controller";
import transaction from "models/transaction.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { userId } = request.query;
  const totals = await transaction.getTotalsByPeriod(userId);
  const balance = await transaction.getBalanceAndForecasts(userId);
  return response.status(200).json({ ...totals, ...balance });
}
