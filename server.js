const express = require("express");
const app = express();
const envelopesRouter = require("./routes/Routes");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Routes
app.use("/envelopes", envelopesRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
