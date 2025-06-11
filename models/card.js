import database from "infra/database.js";

async function create(cardInputValues) {
  const newCard = await runInsertQuery(cardInputValues);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  await createBillForCard(
    newCard.id,
    cardInputValues.userId,
    newCard.payment_day,
    month,
    year,
  );

  return newCard;

  async function runInsertQuery(cardInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          cards (user_id, title, color, payment_day, closing_day)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING 
          *
        ;`,
      values: [
        cardInputValues.userId,
        cardInputValues.title,
        cardInputValues.color,
        cardInputValues.paymentDay,
        cardInputValues.closingDay,
      ],
    });

    return results.rows[0];
  }

  async function createBillForCard(cardId, userId, paymentDay, month, year) {
    const paymentDate = new Date(
      Number(year),
      Number(month),
      Number(paymentDay),
    );

    const title = paymentDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    await database.query({
      text: `
        INSERT INTO bills (card_id, user_id, title, payment_date)
        VALUES ($1, $2, $3, $4)
      `,
      values: [cardId, userId, title, paymentDate],
    });
  }
}

async function findAllByUserId(userId) {
  const cards = (await runSelectQuery(userId)) ?? [];

  return cards;

  async function runSelectQuery(userId) {
    let query = `
      SELECT *
      FROM cards
      WHERE user_id = $1
    `;

    const values = [userId];

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

const card = {
  create,
  findAllByUserId,
};

export default card;
