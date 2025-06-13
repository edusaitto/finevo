import { createRouter } from "next-connect";
import controller from "infra/controller";
import transaction from "models/transaction.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { id } = request.query;
  const foundTransaction = await transaction.findOneById(id);
  return response.status(200).json(foundTransaction);
}
