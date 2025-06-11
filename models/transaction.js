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

async function getTotalsByPeriod(userId) {
  const query = `
    SELECT
      SUM(CASE WHEN transactions.paid_at::date = CURRENT_DATE THEN transactions.value ELSE 0 END) AS day_total,
      SUM(
        CASE 
          WHEN transactions.paid_at::date >= date_trunc('week', CURRENT_DATE)
          AND transactions.paid_at::date <= date_trunc('week', CURRENT_DATE) + INTERVAL '6 days'
          THEN transactions.value
          ELSE 0
        END
      ) AS week_total,
      SUM(CASE WHEN transactions.paid_at >= date_trunc('month', CURRENT_DATE) THEN transactions.value ELSE 0 END) AS month_total
    FROM transactions
    JOIN categories ON transactions.category = categories.id
    JOIN types ON categories.type = types.id
    WHERE transactions.user_id = $1
      AND types.title = 'expense'
  `;

  const values = [userId];

  const result = await database.query({ text: query, values });

  const row = result.rows[0];

  return {
    day: Number(row.day_total) || 0,
    week: Number(row.week_total) || 0,
    month: Number(row.month_total) || 0,
  };
}

async function getBalanceAndForecasts(userId) {
  const query = `
    SELECT
      -- Balance until today (only paid_at <= today)
      SUM(
        CASE 
          WHEN transactions.paid_at::date <= CURRENT_DATE THEN
            CASE WHEN types.title = 'revenue' THEN transactions.value ELSE -transactions.value END
          ELSE 0
        END
      ) AS current_balance,

      -- Forecast until 16th
      SUM(
        CASE 
          WHEN transactions.paid_at::date < date_trunc('month', CURRENT_DATE) + INTERVAL '14 days' THEN
            CASE WHEN types.title = 'revenue' THEN transactions.value ELSE -transactions.value END
          ELSE 0
        END
      ) AS forecast_checkpoint,

      -- Forecast until end of month
      SUM(
        CASE 
          WHEN transactions.paid_at::date <= (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day') THEN
            CASE WHEN types.title = 'revenue' THEN transactions.value ELSE -transactions.value END
          ELSE 0
        END
      ) AS forecast_end_of_month

    FROM transactions
    JOIN categories ON transactions.category = categories.id
    JOIN types ON categories.type = types.id
    WHERE transactions.user_id = $1
      AND transactions.paid_at::date >= date_trunc('month', CURRENT_DATE)
  `;

  const values = [userId];

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
      TO_CHAR(paid_at, 'TMMonth') AS month_name
    FROM transactions
    WHERE user_id = $1
    ORDER BY month_number
  `;

  const values = [userId];

  const result = await database.query({ text: query, values });

  return result.rows.map((row) => ({
    monthNumber: row.month_number,
    monthName: row.month_name.trim(),
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
