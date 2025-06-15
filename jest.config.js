const dotenv = require("dotenv");
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

dotenv.config({ path: ".env.development" });

module.exports = jestConfig;
