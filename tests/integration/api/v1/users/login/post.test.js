import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users/login", () => {
  describe("Anonymous user", () => {
    test("With valid user data", async () => {
      await orchestrator.createUser({
        email: "login@teste.com",
        password: "login123",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "login@teste.com",
          password: "login123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.token).toBeDefined();
      expect(responseBody.token.length).toBeGreaterThan(0);
      expect(responseBody.userId).toBeDefined();
      expect(responseBody.userId.length).toBeGreaterThan(0);
    });

    test("With incorrect user 'email'", async () => {
      await orchestrator.createUser({
        email: "login@email.com",
        password: "login123",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email@login.com",
          password: "login123",
        }),
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "E-mail e/ou senha incorretos.",
        action: "Verifique se os dados foram digitados corretamente.",
        status_code: 404,
      });
    });

    test("With incorrect user 'password'", async () => {
      await orchestrator.createUser({
        email: "login@password.com",
        password: "login123",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "login@password.com",
          password: "123login",
        }),
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "E-mail e/ou senha incorretos.",
        action: "Verifique se os dados foram digitados corretamente.",
        status_code: 404,
      });
    });
  });
});
