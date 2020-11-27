const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");
const fs = require("file-system");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  // temporary content... for testing purposes.
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  const result = await db.collection("greetings1").insertMany(greetings);
  assert.equal(134, result.insertedCount);

  console.log("hello", result);

  client.close();
};

batchImport(greetings);
