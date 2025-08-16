import { createRouter } from "next-connect";
import controller from "infra/controller";
import transaction from "models/transaction.js";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { id } = request.query;
  const foundTransaction = await transaction.findOneById(id);
  return response.status(200).json(foundTransaction);
}

async function patchHandler(request, response) {
  const { id } = request.query;
  const transactionInputValues = request.body;
  const updatedTransaction = await transaction.update(
    id,
    transactionInputValues,
  );
  return response.status(200).json(updatedTransaction);
}
