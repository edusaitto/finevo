import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import { serialize } from "cookie";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const { token, userId } = await user.login(userInputValues);

  response.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 60,
      sameSite: "lax",
    }),
  );

  return response.status(201).json({ userId, token });
}
