const express = require("express");
const HttpStatus = require("http-status-codes");

const app = express();
const PORT = 3001;

const routes = require("./src/routes/routes");

app.listen(PORT, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${PORT}`);
});

app.use(routes);
