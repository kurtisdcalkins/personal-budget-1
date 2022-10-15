const envelopes = require("../models/envelopes");

// Get all envelopes
const getAllEnvelopes = (req, res) => {
  res.send(envelopes);
};

// Create a new envelope
const postNewEnvelope = (req, res) => {
  const newID = envelopes.length + 1;
  const { name, budget, balance } = req.body;
  envelopes.push({ id: Number(newID), name, budget, balance });
  res.status(201).send(envelopes);
};

// Get a single envelope by id
const getSingleEnvelope = (req, res) => {
  const reqID = Number(req.params.id);
  const reqEnvelope = envelopes.find((envelope) => envelope.id === reqID);
  res.status(201).send(reqEnvelope);
};

// Update information for a single envelope by id
const updateEnvelope = (req, res) => {
  const reqID = Number(req.params.id);
  const reqEnvelope = envelopes.find((envelope) => envelope.id === reqID);
  const { name, budget, balance } = req.body;
  if (name) {
    reqEnvelope.name = name;
  }
  if (budget) {
    reqEnvelope.budget = budget;
  }
  if (balance) {
    reqEnvelope.balance = balance;
  }
  res.status(201).send(envelopes);
};

// Delete an envelope by id
const deleteEnvelope = (req, res) => {
  const reqID = Number(req.params.id);
  envelopes.filter((envelope) => envelope.id !== reqID);
  res.status(200).send("Envelope deleted");
};

// Transfer money (balance) from one envelope to another by ids
const transferMoney = (req, res) => {
  const toEnvelopeID = req.params.to;
  const fromEnvelopeID = req.params.from;
  const { amount } = req.body;
  const toEnvelope = envelopes.find((envelope) => envelope.id == toEnvelopeID);
  const fromEnvelope = envelopes.find(
    (envelope) => envelope.id == fromEnvelopeID
  );
  if (!toEnvelope || !fromEnvelope) {
    return res
      .status(404)
      .send("One of those budgets does not exist. Please try again.");
  }
  toEnvelope.balance += amount;
  fromEnvelope.balance -= amount;
  res.status(200).send(envelopes);
};

module.exports = {
  getAllEnvelopes,
  postNewEnvelope,
  getSingleEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferMoney,
};
