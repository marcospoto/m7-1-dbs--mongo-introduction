const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  try {
    const result = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, result.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  const _id = req.params._id;

  console.log(_id);

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  let { start, limit } = req.query;
  start = Number(start);
  limit = Number(limit);

  await client.connect();

  const db = client.db("exercise_1");

  console.log(typeof start);
  console.log(limit);

  let data = [];
  let userData = [];

  if (!start && !limit) {
    data = await db.collection("greetings").find().toArray();
    userData = data.slice(0, 25);
  } else if (!start && limit) {
    data = await db.collection("greetings").find().toArray();
    userData = data.slice(0, limit);
  } else if (start && !limit) {
    data = await db.collection("greetings").find().toArray();
    userData = data.slice(start, start + 25);
  } else {
    data = await db.collection("greetings").find().toArray();
    userData = data.slice(start, start + limit);
    console.log(data);
    console.log(userData);
  }
  if (userData.length === 0) {
    res.status(404).json({
      status: 404,
      message: "No data",
    });
  } else {
    res.status(200).json({
      status: 200,
      data: { userData },
    });
  }
  client.close();
};

const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  const _id = req.params._id;
  db.collection("greetings").deleteOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const query = { _id };
  const body = req.body;
  const newValues = { $set: { ...body } };

  if (!body.hello || Object.keys(body).length > 1) {
    res.status(400).json({
      staus: 400,
      message: "Body must only have hello as key value",
      data: body,
    });
    return;
  }

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const results = await db
      .collection("greetings")
      .updateOne(query, newValues);

    assert.equal(1, results.matchedCount);
    assert.equal(1, results.modifiedCount);

    res.status(204).json({
      status: 204,
      message: "success",
      data: body,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      data: body,
      message: err.message,
    });
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
