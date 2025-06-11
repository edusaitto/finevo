exports.up = (pgm) => {
  pgm.createTable("transactions", {
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
      type: "varchar(100)",
      notNull: true,
    },

    value: {
      type: "numeric(12,2)",
      notNull: true,
    },

    category: {
      type: "uuid",
      references: '"categories"(id)',
      onDelete: "cascade",
    },

    type: {
      type: "uuid",
      references: '"types"(id)',
      onDelete: "cascade",
    },

    card: {
      type: "uuid",
      references: '"cards"(id)',
      onDelete: "cascade",
    },

    bill: {
      type: "uuid",
      references: '"bills"(id)',
      onDelete: "cascade",
    },

    paid_at: {
      type: "timestamptz",
    },

    add_at: {
      type: "timestamptz",
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
