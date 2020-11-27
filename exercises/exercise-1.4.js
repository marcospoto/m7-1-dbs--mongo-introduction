const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  console.log(req.body);
  await client.connect();

  const db = client.db("exercise_1");

  const newUser = await db
    .collection("users")
    .insertOne({ name: req.body.name });

  res.status(201).json({
    status: 201,
    data: { newUser },
  });

  client.close();
};

// addUser("exercise_1");

module.exports = {
  addUser,
};
