exports.up = (pgm) => {
  pgm.createTable("categories", {
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

    type: {
      type: "uuid",
      references: '"types"(id)',
      onDelete: "cascade",
    },

    color: {
      type: "varchar(20)",
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
