import { createRouter } from "next-connect";
import controller from "infra/controller";
import card from "models/card.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const cardInputValues = request.body;
  const newCard = await card.create(cardInputValues);
  return response.status(201).json(newCard);
}
