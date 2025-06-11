import { createRouter } from "next-connect";
import controller from "infra/controller";
import transaction from "models/transaction.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const transactionInputValues = request.body;
  const newTransaction = await transaction.create(transactionInputValues);
  return response.status(201).json(newTransaction);
}
