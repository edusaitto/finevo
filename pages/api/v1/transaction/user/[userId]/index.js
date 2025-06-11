import { createRouter } from "next-connect";
import controller from "infra/controller";
import transaction from "models/transaction.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { userId } = request.query;
  const transactions = await transaction.findAllByUserId(userId);
  return response.status(200).json(transactions);
}
