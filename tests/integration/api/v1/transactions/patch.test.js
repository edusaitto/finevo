import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/transaction", () => {
  describe("Logged user", () => {
    test("Update revenue with valid data", async () => {
      const user = await orchestrator.createUser();
      const types = await orchestrator.findTypes();
      const revenueType = types.find((t) => t.title == "revenue");
      const category = await orchestrator.createCategory({
        userId: user.id,
        type: revenueType.id,
      });

      const date = new Date();

      const transaction = await orchestrator.createTransaction({
        userId: user.id,
        title: "transactionTitle",
        value: 200.5,
        type: revenueType.title,
        category: category.id,
        addAt: date.toISOString(),
        paidAt: date.toISOString(),
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/transaction/${transaction[0].id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "transactionUpdated",
            value: 2001,
            fixed: true,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const updatedTransaction = responseBody;

      expect(updatedTransaction.id).toBeDefined();
      expect(updatedTransaction.id).not.toBeNull();

      expect(updatedTransaction.user_id).toBeDefined();
      expect(updatedTransaction.user_id).not.toBeNull();

      expect(updatedTransaction.title).toBe("transactionUpdated");
      expect(updatedTransaction.value).toBe("2001.00");
      expect(updatedTransaction.fixed).toBe(true);

      expect(updatedTransaction.category).toBeDefined();
      expect(updatedTransaction.type).toBeDefined();
      expect(updatedTransaction.paid_at).toBeDefined();
      expect(updatedTransaction.add_at).toBeDefined();
    });

    test("Update expense with valid data", async () => {
      const user = await orchestrator.createUser();
      const types = await orchestrator.findTypes();
      const expenseType = types.find((t) => t.title == "expense");
      const category = await orchestrator.createCategory({
        userId: user.id,
        type: expenseType.id,
      });

      const date = new Date();

      const transaction = await orchestrator.createTransaction({
        userId: user.id,
        title: "expenseTitle",
        value: 200.5,
        type: expenseType.title,
        category: category.id,
        addAt: date.toISOString(),
        paidAt: date.toISOString(),
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/transaction/${transaction[0].id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "transactionUpdated",
            value: 2002,
            fixed: true,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const updatedTransaction = responseBody;

      expect(updatedTransaction.id).toBeDefined();
      expect(updatedTransaction.id).not.toBeNull();

      expect(updatedTransaction.user_id).toBeDefined();
      expect(updatedTransaction.user_id).not.toBeNull();

      expect(updatedTransaction.title).toBe("transactionUpdated");
      expect(updatedTransaction.value).toBe("2002.00");
      expect(updatedTransaction.fixed).toBe(true);

      expect(updatedTransaction.category).toBeDefined();
      expect(updatedTransaction.type).toBeDefined();
      expect(updatedTransaction.paid_at).toBeDefined();
      expect(updatedTransaction.add_at).toBeDefined();
    });
  });
});
