require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const linkRoutes = require("./routes/linkRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// routes
app.use("/", linkRoutes);

// start
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
