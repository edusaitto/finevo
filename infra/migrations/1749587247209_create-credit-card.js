exports.up = (pgm) => {
  pgm.createTable("cards", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"(id)',
      onDelete: "cascade",
    },

    title: {
      type: "varchar(50)",
      notNull: true,
    },

    color: {
      type: "varchar(20)",
    },

    payment_day: {
      type: "integer",
      notNull: false,
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
};

exports.down = false;
