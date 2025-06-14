import jwt from "jsonwebtoken";
import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

const SECRET_KEY = process.env.JWT_SECRET;

function genToken(user) {
  return jwt.sign(
    {
      email: user.email,
      password: user.password,
    },
    SECRET_KEY,
    { expiresIn: "60d" },
  );
}

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

async function login(userInputValues) {
  const loggedUser = await runSelectUserByEmail(userInputValues.email);

  if (loggedUser == null) {
    throw new NotFoundError({
      message: "E-mail e/ou senha incorretos.",
      action: "Verifique se os dados foram digitados corretamente.",
    });
  }

  const matchPassword = await password.compare(
    userInputValues.password,
    loggedUser.password,
  );

  if (!matchPassword) {
    throw new NotFoundError({
      message: "E-mail e/ou senha incorretos.",
      action: "Verifique se os dados foram digitados corretamente.",
    });
  }

  const token = genToken(userInputValues);

  return { token, userId: loggedUser.id };

  async function runSelectUserByEmail(email) {
    const results = await database.query({
      text: `
        SELECT 
          *
        FROM
          users
        WHERE
          email = $1
        LIMIT
          1
      ;`,
      values: [email],
    });

    return results.rows[0] || null;
  }
}

async function create(userInputValues) {
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
  login,
  create,
  findOneByUsername,
  update,
};

export default user;
