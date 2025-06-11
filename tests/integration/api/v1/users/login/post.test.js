import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users/login", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "saito",
          email: "saito@gmail.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(201);

      const responseLogin = await fetch(
        "http://localhost:3000/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "saito@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(responseLogin.status).toBe(201);

      const responseLoginBody = await responseLogin.json();

      expect(responseLoginBody.token).toBeDefined();
      expect(responseLoginBody.token.length).toBeGreaterThan(0);
      expect(responseLoginBody.userId).toBeDefined();
      expect(responseLoginBody.userId.length).toBeGreaterThan(0);
    });
  });
});
