let chai = require("chai");
let expect = chai.expect;
// let sinon = require("sinon");
// let chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const HttpStatus = require("http-status-codes");
const base64 = require("base-64");
const fetch = require("node-fetch");

const api = require("../src/utils/api/api");

const BASE_URL = api.BASE_URL;
let refresh_token;
let access_token;
describe("API", function () {
  describe("#call_api Login", function () {
    it("should return refresh_token", async function () {
      const meta = {
        authorization: `Basic ${base64.encode(`BankinClientId:secret`)}`,
        "Content-Type": "application/json",
        "cache-control": "no-cache",
        Accept: "application/json",
      };
      let headers = new fetch.Headers(meta);
      let body = {
        user: "BankinUser",
        password: "12345678",
      };
      let options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      };
      let url = `${BASE_URL}/login`;

      let response = await api.call_api(url, options);
      expect(response.code).to.be.equal(HttpStatus.OK);
      expect(response.err).to.null;
      expect(response.data).to.be.not.empty;
      expect(response.data.refresh_token).to.be.not.empty;
      refresh_token = response.data.refresh_token;
    });
  });

  describe("#call_api Token", function () {
    it("should return access_token", async function () {
      const meta = {
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        Accept: "application/json",
      };
      let headers = new fetch.Headers(meta);
      let body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      });
      let options = {
        method: "POST",
        headers: headers,
        body: body,
      };
      let url = `${BASE_URL}/token`;

      let response = await api.call_api(url, options);
      expect(response.code).to.be.equal(HttpStatus.OK);
      expect(response.err).to.null;
      expect(response.data).to.be.not.empty;
      expect(response.data.access_token).to.be.not.empty;
      access_token = response.data.access_token;
    });
  });

  describe("#call_api Account", function () {
    it("should return all user's accounts", async function () {
      const meta = {
        authorization: `Bearer ${access_token}`,
        "cache-control": "no-cache",
        Accept: "application/json",
      };
      let headers = new fetch.Headers(meta);
      let options = {
        method: "GET",
        headers: headers,
      };
      let url = `${BASE_URL}/accounts`;

      let response = await api.call_api(url, options);
      expect(response.code).to.be.equal(HttpStatus.OK);
      expect(response.err).to.null;
      expect(response.data).to.be.not.empty;
      expect(response.data.account).to.be.not.empty;
      expect(response.data.link).to.be.not.empty;
      response.data.account.map((account) => {
        expect(account).to.have.property("acc_number");
        expect(account).to.have.property("amount");
        expect(account).to.have.property("currency");
      });
    });
  });

  describe("#call_api Transactions", function () {
    it("should return an account's transactions, by account number", async function () {
      const meta = {
        authorization: `Bearer ${access_token}`,
        "cache-control": "no-cache",
        Accept: "application/json",
      };
      let headers = new fetch.Headers(meta);
      let options = {
        method: "GET",
        headers: headers,
      };
      let url = `${BASE_URL}/accounts/000000001/transactions`;

      let response = await api.call_api(url, options);
      expect(response.code).to.be.equal(HttpStatus.OK);
      expect(response.err).to.null;
      expect(response.data).to.be.not.empty;
      expect(response.data.transactions).to.be.not.empty;
      expect(response.data.link).to.be.not.empty;
      response.data.transactions.map((transaction) => {
        expect(transaction).to.have.property("id");
        expect(transaction).to.have.property("label");
        expect(transaction).to.have.property("sign");
        expect(transaction).to.have.property("amount");
        expect(transaction).to.have.property("currency");
      });
    });
  });

  describe("#parse_account", function () {
    it("should return accounts and their transactions", async function () {
      const meta = {
        authorization: `Bearer ${access_token}`,
        "cache-control": "no-cache",
        Accept: "application/json",
      };
      let headers = new fetch.Headers(meta);
      let options = {
        method: "GET",
        headers: headers,
      };
      let url_accounts = `${BASE_URL}/accounts`;
      let url_transactions = `${BASE_URL}/accounts/acc_number/transactions`;

      let response = await api.parse_account(
        (url_base = BASE_URL),
        url_accounts,
        url_transactions,
        options
      );
      expect(response.code).to.be.equal(HttpStatus.OK);
      expect(response.err).to.null;
      expect(response.data).to.be.not.empty;
      response.data.map((account) => {
        expect(account).to.have.property("acc_number");
        expect(account).to.have.property("amount");
        expect(account).to.have.property("transactions");
        account.transactions.map((transaction) => {
          expect(transaction).to.have.property("label");
          expect(transaction).to.have.property("amount");
          expect(transaction).to.have.property("currency");
        });
      });
    });
  });
});
