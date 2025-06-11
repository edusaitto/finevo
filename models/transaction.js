import database from "infra/database.js";

async function create(transactionInputValues) {
  const newTransaction = await runInsertQuery(transactionInputValues);
  return newTransaction;

  async function runInsertQuery(transactionInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          transactions (user_id, title, value, type, category, card, bill, paid_at, add_at)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING 
          *
        ;`,
      values: [
        transactionInputValues.userId,
        transactionInputValues.title,
        transactionInputValues.value,
        transactionInputValues.type,
        transactionInputValues.category,
        transactionInputValues.card,
        transactionInputValues.bill,
        transactionInputValues.paidAt,
        transactionInputValues.addAt,
      ],
    });

    return results.rows[0];
  }
}

async function findAllByUserId(userId) {
  const transactions = (await runSelectQuery(userId)) ?? [];

  return transactions;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          transactions
        WHERE 
          user_id = $1
        ;`,
      values: [userId],
    });

    return results.rows;
  }
}

const transaction = {
  create,
  findAllByUserId,
};

export default transaction;
