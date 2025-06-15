import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/transaction", () => {
  describe("Logged user", () => {
    test("Insert revenue with valid data", async () => {
      const user = await orchestrator.createUser();
      const types = await orchestrator.findTypes();
      const revenueType = types.find((t) => t.title == "revenue");
      const category = await orchestrator.createCategory({
        userId: user.id,
        type: revenueType.id,
      });

      const date = new Date();

      const response = await fetch(`http://localhost:3000/api/v1/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: "transactionTitle",
          value: 200.5,
          type: revenueType.title,
          category: category.id,
          addAt: date.toISOString(),
          paidAt: date.toISOString(),
          fixed: false,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      const transaction = responseBody[0];

      expect(transaction.id).toBeDefined();
      expect(transaction.id).not.toBeNull();

      expect(transaction.user_id).toBeDefined();
      expect(transaction.user_id).not.toBeNull();

      expect(transaction.title).toBe("transactionTitle");
      expect(transaction.value).toBe("200.50");
      expect(transaction.fixed).toBe(false);

      expect(transaction.category).toBeDefined();
      expect(transaction.type).toBeDefined();
      expect(transaction.paid_at).toBeDefined();
      expect(transaction.add_at).toBeDefined();
    });

    test("Insert expense with valid data", async () => {
      const user = await orchestrator.createUser();
      const types = await orchestrator.findTypes();
      const expenseType = types.find((t) => t.title == "expense");
      const category = await orchestrator.createCategory({
        userId: user.id,
        type: expenseType.id,
      });

      const date = new Date();

      const response = await fetch(`http://localhost:3000/api/v1/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: "expenseTitle",
          value: 200.5,
          type: expenseType.title,
          category: category.id,
          addAt: date.toISOString(),
          paidAt: date.toISOString(),
          fixed: false,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      const transaction = responseBody[0];

      expect(transaction.id).toBeDefined();
      expect(transaction.id).not.toBeNull();

      expect(transaction.user_id).toBeDefined();
      expect(transaction.user_id).not.toBeNull();

      expect(transaction.title).toBe("expenseTitle");
      expect(transaction.value).toBe("200.50");
      expect(transaction.fixed).toBe(false);

      expect(transaction.category).toBeDefined();
      expect(transaction.type).toBeDefined();
      expect(transaction.paid_at).toBeDefined();
      expect(transaction.add_at).toBeDefined();
    });
  });
});
