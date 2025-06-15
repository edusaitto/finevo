import database from "infra/database.js";

async function getCardBills(cardId) {
  const bils = (await runSelectQuery(cardId)) ?? [];
  return bils;

  async function runSelectQuery(cardId) {
    let query = `
      SELECT *
      FROM bills
      WHERE card_id = $1
    `;

    const values = [cardId];

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

async function getTransactionsFromBill(billId) {
  const transactions = (await runSelectQuery(billId)) ?? [];
  return transactions;

  async function runSelectQuery(billId) {
    const query = `
      SELECT *
      FROM transactions
      WHERE bill = $1
      ORDER BY add_at DESC
    `;

    const values = [billId];

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

async function getBillsByUserAndMonth(userId, month, year) {
  const query = `
    SELECT 
      b.id,
      b.title AS bill_title,
      b.payment_date,
      c.id AS card_id,
      c.title AS card_title,
      c.color AS color,
      b.user_id,
      COALESCE((
        SELECT SUM(t.value)
        FROM transactions t
        WHERE t.bill = b.id
          AND EXTRACT(MONTH FROM t.paid_at) = $2
          AND EXTRACT(YEAR FROM t.paid_at) = $3
      ), 0) AS total_value
    FROM bills b
    JOIN cards c ON b.card_id = c.id
    WHERE 
      b.user_id = $1
      AND EXTRACT(MONTH FROM b.payment_date) = $2
      AND EXTRACT(YEAR FROM b.payment_date) = $3
    ORDER BY c.title;
  `;

  const values = [userId, month, year];
  const results = await database.query({ text: query, values });

  return results.rows;
}

const bill = {
  getCardBills,
  getTransactionsFromBill,
  getBillsByUserAndMonth,
};

export default bill;
