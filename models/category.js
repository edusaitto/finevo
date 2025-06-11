import database from "infra/database.js";

async function create(categoryInputValues) {
  const newCategory = await runInsertQuery(categoryInputValues);
  return newCategory;

  async function runInsertQuery(categoryInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          categories (user_id, title, color)
        VALUES
          ($1, $2, $3)
        RETURNING 
          *
        ;`,
      values: [
        categoryInputValues.userId,
        categoryInputValues.title,
        categoryInputValues.color,
      ],
    });

    return results.rows[0];
  }
}

async function findAllByUserId(userId) {
  const categories = (await runSelectQuery(userId)) ?? [];

  return categories;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          categories
        WHERE 
          user_id = $1
        ;`,
      values: [userId],
    });

    return results.rows;
  }
}

const category = {
  create,
  findAllByUserId,
};

export default category;
