import { createRouter } from "next-connect";
import controller from "infra/controller";
import bills from "models/bills.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { userId, month, year } = request.query;
  const foundBills = await bills.getBillsByUserAndMonth(userId, month, year);
  return response.status(200).json(foundBills);
}
