import { createRouter } from "next-connect";
import controller from "infra/controller";
import category from "models/category.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const categoryInputValues = request.body;
  const newCategory = await category.create(categoryInputValues);
  return response.status(201).json(newCategory);
}
