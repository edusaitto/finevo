exports.up = (pgm) => {
  pgm.createTable("types", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    title: {
      type: "varchar(50)",
      notNull: true,
    },

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
    INSERT INTO types (id, title, created_at, updated_at)
    VALUES 
      (gen_random_uuid(), 'expense', timezone('utc', now()), timezone('utc', now())),
      (gen_random_uuid(), 'revenue', timezone('utc', now()), timezone('utc', now()));
  `);
};

exports.down = false;
