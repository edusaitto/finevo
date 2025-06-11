import database from "infra/database.js";

async function findAll() {
  const types = (await runSelectQuery()) ?? [];

  return types;

  async function runSelectQuery() {
    const results = await database.query({
      text: `
        SELECT
          id, title
        FROM
          types
        ;`,
    });

    return results.rows;
  }
}

const type = {
  findAll,
};

export default type;
