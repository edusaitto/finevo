import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";
import category from "models/category.js";
import transactionType from "models/type.js";
import transaction from "models/transaction.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  if (!userObject) {
    return await user.create({
      name: faker.internet.username().replace(/[_.-]/g, ""),
      email: faker.internet.email(),
      password: "validpassword",
    });
  }

  return await user.create({
    name: userObject.name || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validpassword",
  });
}

async function findTypes() {
  return await transactionType.findAll();
}

async function createCategory(categoryObject) {
  return await category.create({
    userId: categoryObject.userId,
    title: categoryObject.title || "categoryTitle",
    color: categoryObject.color || "#000000",
    type: categoryObject.type,
  });
}

async function createTransaction(transactionObject) {
  return await transaction.create({
    userId: transactionObject.userId,
    type: transactionObject.type,
    addAt: transactionObject.addAt,
    paidAt: transactionObject.paidAt,
    category: transactionObject.category,
    title: transactionObject.title || "transactionTitle",
    value: transactionObject.value || 100.0,
    fixed: transactionObject.fixed || false,
  });
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  findTypes,
  createCategory,
  createTransaction,
};

export default orchestrator;
