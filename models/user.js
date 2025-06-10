import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByUsername(name) {
  const userFound = await runSelectQuery(name);

  return userFound;

  async function runSelectQuery(name) {
    const results = await database.query({
      text: `
        SELECT 
          *
        FROM
          users
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
        ;`,
      values: [name],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O name informado não foi encontrado no sistema.",
        action: "Verifique se o name está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.name);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          users (name, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING 
          *
        ;`,
      values: [
        userInputValues.name,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function update(name, userInputValues) {
  const currentUser = await findOneByUsername(name);

  if ("name" in userInputValues) {
    await validateUniqueUsername(userInputValues.name);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
        UPDATE 
          users
        SET
          name = $1,
          password = $2,
          email = $3,
          updated_at = timezone('utc', now())
        WHERE 
          id = $4
        RETURNING
          *
        `,
      values: [
        userWithNewValues.name,
        userWithNewValues.password,
        userWithNewValues.email,
        userWithNewValues.id,
      ],
    });

    return results.rows[0];
  }
}

async function validateUniqueUsername(name) {
  const results = await database.query({
    text: `
      SELECT 
        name
      FROM
        users
      WHERE
        LOWER(name) = LOWER($1)
      ;`,
    values: [name],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O name informado já está sendo utilizado.",
      action: "Utilize outro name para realizar esta operação.",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
      SELECT 
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
