import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/categories", () => {
  describe("Logged user", () => {
    test("Insert category with valid data", async () => {
      const user = await orchestrator.createUser();

      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: "newCategory",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.id).toBeDefined();
      expect(responseBody.id).not.toBeNull();

      expect(responseBody.user_id).toBeDefined();
      expect(responseBody.user_id).not.toBeNull();

      expect(responseBody.title).toBeDefined();
      expect(responseBody.title).not.toBeNull();
    });
  });
});
