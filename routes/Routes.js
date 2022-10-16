const express = require("express");
const router = express.Router();

const envelopes = require("../models/envelopes");

const {
  getAllEnvelopes,
  postNewEnvelope,
  getSingleEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferMoney,
  postTransaction,
} = require("../controllers/Contollers");

router.route("/").get(getAllEnvelopes).post(postNewEnvelope);

router
  .route("/:id")
  .get(getSingleEnvelope)
  .put(updateEnvelope)
  .delete(deleteEnvelope);

router.route("/transfer/:to/:from").post(transferMoney);

router.route("/transaction/:id").post(postTransaction);
module.exports = router;
