import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/cards", () => {
  describe("Logged user", () => {
    test("Insert card with valid data", async () => {
      const user = await orchestrator.createUser();

      const response = await fetch("http://localhost:3000/api/v1/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: "cardTitle",
          color: "#000000",
          paymentDay: 10,
          closingDay: 15,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.id).toBeDefined();
      expect(responseBody.id).not.toBeNull();

      expect(responseBody.user_id).toBeDefined();
      expect(responseBody.user_id).not.toBeNull();

      expect(responseBody.title).toBe("cardTitle");
      expect(responseBody.color).toBe("#000000");
      expect(responseBody.payment_day).toBe(10);
      expect(responseBody.closing_day).toBe(15);
    });
  });
});
