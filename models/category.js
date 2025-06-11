import database from "infra/database.js";

async function create(categoryInputValues) {
  const newCategory = await runInsertQuery(categoryInputValues);
  return newCategory;

  async function runInsertQuery(categoryInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          categories (user_id, title, color, type)
        VALUES
          ($1, $2, $3, $4)
        RETURNING 
          *
        ;`,
      values: [
        categoryInputValues.userId,
        categoryInputValues.title,
        categoryInputValues.color,
        categoryInputValues.type,
      ],
    });

    return results.rows[0];
  }
}

async function findAllByUserId(userId, type) {
  const categories = (await runSelectQuery(userId, type)) ?? [];
  return categories;

  async function runSelectQuery(userId, type) {
    let query = `
     SELECT categories.*
      FROM categories
      INNER JOIN types ON categories.type = types.id
      WHERE categories.user_id = $1
    `;
    const values = [userId];

    if (type) {
      query += ` AND types.title = $2`;
      values.push(type);
    }

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

const category = {
  create,
  findAllByUserId,
};

export default category;
