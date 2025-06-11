import database from "infra/database.js";

async function create(transactionInputValues) {
  const { repeat = 1, card } = transactionInputValues;

  const type = await database.query({
    text: `SELECT * FROM types WHERE title = $1 LIMIT 1;`,
    values: [transactionInputValues.type],
  });

  const typeId = type.rows[0].id;
  const createdTransactions = [];

  for (let i = 0; i < repeat; i++) {
    const futureDate = new Date(transactionInputValues.paidAt);
    futureDate.setMonth(futureDate.getMonth() + i);
    const month = futureDate.getMonth() + 1;
    const year = futureDate.getFullYear();

    let billId = transactionInputValues.bill;

    if (card) {
      // Verifica se a fatura já existe para o mês/ano
      const billResult = await database.query({
        text: `
          SELECT id FROM bills
          WHERE card_id = $1 AND EXTRACT(MONTH FROM payment_date) = $2 AND EXTRACT(YEAR FROM payment_date) = $3
          LIMIT 1;
        `,
        values: [card, month, year],
      });

      if (billResult.rowCount > 0) {
        billId = billResult.rows[0].id;
      } else {
        // Cria nova fatura se não existir
        const paymentDay = transactionInputValues.paymentDay || 1;
        const paymentDate = new Date(year, month - 1, paymentDay);

        const newBill = await database.query({
          text: `
            INSERT INTO bills (card_id, user_id, title, payment_date)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
          `,
          values: [
            card,
            transactionInputValues.userId,
            `${month}/${year}`,
            paymentDate,
          ],
        });

        billId = newBill.rows[0].id;
      }
    }

    // Insere a transação (para o mês atual ou futuro)
    const result = await database.query({
      text: `
        INSERT INTO 
          transactions (user_id, title, value, type, category, card, bill, paid_at, add_at)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `,
      values: [
        transactionInputValues.userId,
        transactionInputValues.title,
        transactionInputValues.value,
        typeId,
        transactionInputValues.category,
        card || null,
        billId || null,
        futureDate || null,
        transactionInputValues.addAt,
      ],
    });

    createdTransactions.push(result.rows[0]);
  }

  return createdTransactions;
}

async function getTotalsByPeriod(userId, month, year) {
  const query = `
    WITH bounds AS (
      SELECT 
        make_date($2, $1, 1)::date AS month_start,
        (make_date($2, $1, 1) + INTERVAL '1 month - 1 day')::date AS month_end,
        CURRENT_DATE AS today,
        date_trunc('week', CURRENT_DATE)::date AS week_start,
        (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::date AS week_end
    )
    SELECT
      SUM(
        CASE 
          WHEN t.paid_at::date = b.today THEN t.value 
          ELSE 0 
        END
      ) AS day_total,

      SUM(
        CASE 
          WHEN t.paid_at::date BETWEEN b.week_start AND b.week_end 
          THEN t.value 
          ELSE 0 
        END
      ) AS week_total,

      SUM(
        CASE 
          WHEN t.paid_at::date BETWEEN b.month_start AND b.month_end 
          THEN t.value 
          ELSE 0 
        END
      ) AS month_total

    FROM transactions t
    JOIN categories c ON t.category = c.id
    JOIN types ty ON c.type = ty.id
    CROSS JOIN bounds b
    WHERE t.user_id = $3
      AND ty.title = 'expense'
  `;

  const values = [month, year, userId];

  const result = await database.query({ text: query, values });

  const row = result.rows[0];

  return {
    day: Number(row.day_total) || 0,
    week: Number(row.week_total) || 0,
    month: Number(row.month_total) || 0,
  };
}

async function getBalanceAndForecasts(userId, month, year) {
  const query = `
    WITH date_bounds AS (
      SELECT 
        -- limites para o mês/ano passado (usado nos forecasts)
        make_date($2, $1, 1) AS input_month_start,
        (make_date($2, $1, 1) + INTERVAL '1 month - 1 day')::date AS input_month_end,
        (make_date($2, $1, 1) + INTERVAL '14 days')::date AS input_checkpoint_day,

        -- limites para o mês atual do sistema (usado no current_balance)
        date_trunc('month', CURRENT_DATE)::date AS current_month_start,
        (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::date AS current_month_end,
        LEAST(CURRENT_DATE, (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::date) AS current_today
    )
    SELECT
      -- current_balance sempre do mês atual do sistema
      SUM(
        CASE
          WHEN t.paid_at::date >= db.current_month_start
          AND t.paid_at::date <= db.current_today THEN
            CASE WHEN ty.title = 'revenue' THEN t.value ELSE -t.value END
          ELSE 0
        END
      ) AS current_balance,

      -- forecasts usando mês/ano passado
      SUM(
        CASE
          WHEN t.paid_at::date >= db.input_month_start
          AND t.paid_at::date < db.input_checkpoint_day THEN
            CASE WHEN ty.title = 'revenue' THEN t.value ELSE -t.value END
          ELSE 0
        END
      ) AS forecast_checkpoint,

      SUM(
        CASE
          WHEN t.paid_at::date >= db.input_month_start
          AND t.paid_at::date <= db.input_month_end THEN
            CASE WHEN ty.title = 'revenue' THEN t.value ELSE -t.value END
          ELSE 0
        END
      ) AS forecast_end_of_month

    FROM transactions t
    JOIN categories c ON t.category = c.id
    JOIN types ty ON c.type = ty.id
    CROSS JOIN date_bounds db
    WHERE t.user_id = $3
      AND t.paid_at::date >= LEAST(db.current_month_start, db.input_month_start)
      AND t.paid_at::date <= GREATEST(db.current_month_end, db.input_month_end)
    ;
  `;

  const values = [month, year, userId];

  const result = await database.query({ text: query, values });

  const row = result.rows[0];

  return {
    currentBalance: Number(row.current_balance) || 0,
    forecastCheckpoint: Number(row.forecast_checkpoint) || 0,
    forecastEndOfMonth: Number(row.forecast_end_of_month) || 0,
  };
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

    query += ` ORDER BY transactions.paid_at DESC`;

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

async function getUserMonths(userId) {
  const query = `
    SELECT DISTINCT 
      EXTRACT(MONTH FROM paid_at)::int AS month_number,
      TO_CHAR(paid_at, 'TMMonth') AS month_name,
      EXTRACT(YEAR FROM paid_at)::int AS year
    FROM transactions
    WHERE user_id = $1
    ORDER BY month_number ASC, year ASC
  `;

  const values = [userId];

  const result = await database.query({ text: query, values });

  console.log(result.rows);
  return result.rows.map((row) => ({
    monthNumber: row.month_number,
    monthName: row.month_name.trim(),
    year: row.year,
  }));
}

async function getMonthExpenses(userId, monthNumber) {
  console.log(monthNumber);
  const query = `
    SELECT 
      transactions.*,
      types.title AS type_title
    FROM 
      transactions
    JOIN categories ON transactions.category = categories.id
    JOIN types ON categories.type = types.id
    WHERE 
      transactions.user_id = $1
      AND EXTRACT(MONTH FROM transactions.paid_at) = $2
    ORDER BY 
      transactions.paid_at DESC
  `;

  const values = [userId, monthNumber];

  const result = await database.query({ text: query, values });

  return result.rows;
}

const transaction = {
  create,
  findAllByUserId,
  getBalanceAndForecasts,
  getTotalsByPeriod,
  getUserMonths,
  getMonthExpenses,
};

export default transaction;
