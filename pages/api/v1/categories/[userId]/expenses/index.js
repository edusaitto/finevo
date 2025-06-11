import { createRouter } from "next-connect";
import controller from "infra/controller";
import category from "models/category.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { userId } = request.query;
  const categories = await category.findAllByUserId(userId, "expense");
  return response.status(200).json(categories);
}
