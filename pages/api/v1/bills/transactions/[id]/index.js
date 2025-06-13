import { createRouter } from "next-connect";
import controller from "infra/controller";
import bills from "models/bills.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { id } = request.query;
  const transactions = await bills.getTransactionsFromBill(id);
  return response.status(200).json(transactions);
}
