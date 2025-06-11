import database from "infra/database.js";

async function create(transactionInputValues) {
  const newTransaction = await runInsertQuery(transactionInputValues);
  return newTransaction;

  async function runInsertQuery(transactionInputValues) {
    const type = await database.query({
      text: `
        SELECT
          *
        FROM 
          types
        WHERE
          title = $1
        LIMIT 
          1
        ;`,
      values: [transactionInputValues.type],
    });

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
        type.rows[0].id,
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

async function findAllByUserId(userId, type) {
  const transactions = (await runSelectQuery(userId, type)) ?? [];
  return transactions;

  async function runSelectQuery(userId, type) {
    let query = `
      SELECT 
        transactions.*, 
        types.title AS type_title
      FROM 
        transactions
      JOIN 
        categories ON transactions.category = categories.id
      JOIN 
        types ON categories.type = types.id
      WHERE 
        transactions.user_id = $1
    `;
    const values = [userId];

    if (type) {
      query += ` AND type = $2`;
      values.push(type);
    }

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

const transaction = {
  create,
  findAllByUserId,
};

export default transaction;
