exports.up = (pgm) => {
  pgm.createTable("bills", {
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

    card_id: {
      type: "uuid",
      notNull: true,
      references: '"cards"(id)',
      onDelete: "cascade",
    },

    title: {
      type: "varchar(50)",
      notNull: true,
    },

    payment_date: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
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
