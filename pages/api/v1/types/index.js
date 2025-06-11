import { createRouter } from "next-connect";
import controller from "infra/controller";
import type from "models/type.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const types = await type.findAll();
  return response.status(200).json(types);
}
