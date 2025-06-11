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

const bill = {
  getCardBills,
};

export default bill;
