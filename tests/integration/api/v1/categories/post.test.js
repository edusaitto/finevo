import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/categories", () => {
  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const user = await orchestrator.createUser();

      const responseCategory = await fetch(
        "http://localhost:3000/api/v1/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            title: "newCategory",
          }),
        },
      );

      expect(responseCategory.status).toBe(201);

      const responseCategoryBody = await responseCategory.json();

      expect(responseCategoryBody.id).toBeDefined();
      expect(responseCategoryBody.id).not.toBeNull();

      expect(responseCategoryBody.user_id).toBeDefined();
      expect(responseCategoryBody.user_id).not.toBeNull();

      expect(responseCategoryBody.title).toBeDefined();
      expect(responseCategoryBody.title).not.toBeNull();
    });
  });
});
