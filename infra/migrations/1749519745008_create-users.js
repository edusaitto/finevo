exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // For reference, GitHub limits usernames to 39 characters.
    name: {
      type: "varchar(39)",
      notNull: true,
    },

    // Why 254 in length? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Why timestamptz with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });

  pgm.sql(`
    INSERT INTO users (id, name, email, password, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'Usuário Teste',
      'teste@gmail.com',
      '$2b$10$FoI74FEYdngqx2T8Nn4a1ejzYuHkqKe8oxcbq5hD08QpT0boDNt6q',
      timezone('utc', now()),
      timezone('utc', now())
    );
  `);
};

exports.down = false;
