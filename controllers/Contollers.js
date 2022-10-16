const envelopes = require("../models/envelopes");

// Connect to postgres database
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "budget_envelopes",
  password: "mepassword",
  port: 5432,
});

// Get all envelopes
const getAllEnvelopes = (req, res) => {
  pool.query("SELECT * FROM envelopes ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

// Create a new envelope
const postNewEnvelope = (req, res) => {
  const { name, budget, balance } = req.body;
  pool.query(
    "INSERT INTO envelopes (name, budget, balance) VALUES ($1, $2, $3) RETURNING *",
    [name, budget, balance],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .send(
          `Added new envelope: \nname: ${name}, \nbudget: ${budget}, \nbalance: ${balance}`
        );
    }
  );
};

// Get a single envelope by id
const getSingleEnvelope = (req, res) => {
  const reqID = parseInt(req.params.id);
  pool.query(
    "SELECT * FROM envelopes WHERE id = $1",
    [reqID],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

// Update information for a single envelope by id
const updateEnvelope = (req, res) => {
  const reqID = Number(req.params.id);
  const { name, budget, balance } = req.body;

  if (name) {
    pool.query(
      "UPDATE envelopes SET name = $1 WHERE id = $2",
      [name, reqID],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  }
  if (budget) {
    pool.query(
      "UPDATE envelopes SET budget = $1 WHERE id = $2",
      [budget, reqID],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  }
  if (balance) {
    pool.query(
      "UPDATE envelopes SET balance = $1 WHERE id = $2",
      [balance, reqID],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  }
  res.status(200).send(`Envelope with id ${reqID} upated`);
};

// Delete an envelope by id
const deleteEnvelope = (req, res) => {
  const reqID = Number(req.params.id);
  pool.query(
    "DELETE FROM envelopes WHERE id = $1",
    [reqID],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User deleted with ID: ${reqID}`);
    }
  );
};

// Transfer money (balance) from one envelope to another by ids

// Function to get current column value from envelope using id
const getColValue = (resolve, col_name, envId) => {
  pool.query(
    `SELECT ${col_name} FROM envelopes WHERE id = $1`,
    [envId],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (col_name === "name") {
        resolve(results.rows[0].name);
      } else {
        resolve(results.rows[0].balance);
      }
    }
  );
};

const transferMoney = async (req, res) => {
  const toEnvelopeID = parseInt(req.params.to);
  const fromEnvelopeID = parseInt(req.params.from);
  const { amount } = req.body;

  //   Get the name of the envelope into which the money is transferred
  const toName = await new Promise((resolve) => {
    getColValue(resolve, "name", toEnvelopeID);
  });

  //   Get the name of the envelope from which the money is transferred
  const fromName = await new Promise((resolve) => {
    getColValue(resolve, "name", fromEnvelopeID);
  });

  const toCurrentBalance = await new Promise((resolve) => {
    getColValue(resolve, "balance", toEnvelopeID);
  });

  const fromCurrentBalance = await new Promise((resolve) => {
    getColValue(resolve, "balance", fromEnvelopeID);
  });

  const toNewAmount = parseInt(toCurrentBalance) + amount;
  const fromNewAmount = fromCurrentBalance - amount;

  pool.query("UPDATE envelopes SET balance = $1 WHERE id = $2", [
    toNewAmount,
    toEnvelopeID,
  ]);
  pool.query("UPDATE envelopes SET balance = $1 WHERE id = $2", [
    fromNewAmount,
    fromEnvelopeID,
  ]);

  res.send(
    `Sent ${amount} dollars from envelope ${fromName} to envelope ${toName}`
  );
};

const postTransaction = async (req, res) => {
  return;
};

module.exports = {
  getAllEnvelopes,
  postNewEnvelope,
  getSingleEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferMoney,
  postTransaction,
};
