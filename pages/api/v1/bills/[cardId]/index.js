import { createRouter } from "next-connect";
import controller from "infra/controller";
import bills from "models/bills.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { cardId } = request.query;
  const foundBills = await bills.getCardBills(cardId);
  return response.status(200).json(foundBills);
}
