const express = require("express");
router = express.Router();

const api = require("../utils/api/api");
const controllers = require("../controllers/controllers");

router.route("/accounts").post(async (req, res) => {
  let response = await controllers.prepare_parse_accounts(
    req.body.user,
    req.body.password,
    req.headers.authorization
  );
  res.status(response.code).json(response.data);
});

module.exports = router;
