import { createRouter } from "next-connect";
import controller from "infra/controller";
import card from "models/card.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { userId } = request.query;

  const cards = await card.findAllByUserId(userId);

  return response.status(200).json(cards);
}
