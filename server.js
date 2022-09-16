const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const envelopes = [
  {
    id: 1,
    name: "bills",
    budget: 300,
    transactions: [15, 120],
    balance: 300,
  },
  {
    id: 2,
    name: "groceries",
    budget: 500,
    transactions: [7],
    balance: 500,
  },
];

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/envelopes", (req, res) => {
  envelopes.forEach((envelope) => {
    const sumTrans = envelope.transactions.reduce(
      (initial, each) => initial + each,
      0
    );
    envelope.balance = envelope.budget - sumTrans;
  });
  res.send(envelopes);
});

app.post("/envelopes", (req, res) => {
  const newID = envelopes.length + 1;
  const { name, budget, transactions, balance } = req.body;
  envelopes.push({ id: Number(newID), name, budget, transactions, balance });
  res.status(201).send(envelopes);
});

app.get("/envelopes/:id", (req, res) => {
  const reqID = Number(req.params.id);
  const reqEnvelope = envelopes.find((envelope) => envelope.id === reqID);
  const sumTrans = reqEnvelope.transactions.reduce(
    (initial, each) => initial + each,
    0
  );
  reqEnvelope.balance = reqEnvelope.budget - sumTrans;
  res.status(201).send(reqEnvelope);
});

app.put("/envelopes/:id", (req, res) => {
  const reqID = Number(req.params.id);
  const reqEnvelope = envelopes.find((envelope) => envelope.id === reqID);
  const { name, budget, transaction } = req.body;
  if (name) {
    reqEnvelope.name = name;
  }
  if (budget) {
    reqEnvelope.budget = budget;
  }
  if (transaction) {
    reqEnvelope.transactions.push(transaction);
    const sumTrans = reqEnvelope.transactions.reduce(
      (initial, each) => initial + each,
      0
    );
    reqEnvelope.balance = reqEnvelope.budget - sumTrans;
  }
  res.status(201).send(envelopes);
});

app.delete("/envelopes/:id", (req, res) => {
  const reqID = Number(req.params.id);
  let newEnvelopes = envelopes.filter((envelope) => envelope.id !== reqID);
  res.status(200).send(newEnvelopes);
});

app.post("/envelopes/transfer/:to/:from", (req, res) => {
  const toEnvelopeName = req.params.to;
  const fromEnvelopeName = req.params.from;
  const { amount } = req.body;
  const toEnvelope = envelopes.find(
    (envelope) => envelope.name === toEnvelopeName
  );
  const fromEnvelope = envelopes.find(
    (envelope) => envelope.name === fromEnvelopeName
  );
  if (!toEnvelope || !fromEnvelope) {
    return res
      .status(404)
      .send("One of those budgets does not exist. Please try again.");
  }
  const toSumTrans = toEnvelope.transactions.reduce(
    (initial, each) => initial + each,
    0
  );
  const fromSumTrans = fromEnvelope.transactions.reduce(
    (initial, each) => initial + each,
    0
  );
  toEnvelope.budget += amount;
  fromEnvelope.budget -= amount;
  toEnvelope.balance = toEnvelope.budget - toSumTrans;
  fromEnvelope.balance = fromEnvelope.budget - fromSumTrans;
  res.status(200).send(envelopes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
