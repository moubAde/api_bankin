const express = require("express");
const bodyParser = require("body-parser");

const HttpStatus = require("http-status-codes");

const app = express();
const PORT = 3001;

const routes = require("./src/routes/routes");

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.listen(PORT, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${PORT}`);
});

app.use(routes);

app.all("*", (req, res) => {
  res.status(404).json({ "Error 404": "Not Found" });
});
