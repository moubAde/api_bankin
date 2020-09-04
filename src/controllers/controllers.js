const base64 = require("base-64");
const fetch = require("node-fetch");
const HttpStatus = require("http-status-codes");

const api = require("../utils/api/api");

/**
 * @description Used to get a Refresh Token for a registered User
 * @param {string} username Name of the user
 * @param {string} password Password of the user
 * @param {string} authorization Authorization
 * @return {Object} Result of call API
 */
async function login(username, password, authorization) {
  let meta = {
    authorization: `${authorization}`,
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    Accept: "application/json",
  };
  let headers = new fetch.Headers(meta);
  let body = {
    user: username,
    password: password,
  };
  let options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };
  let url = `${api.BASE_URL}/login`;
  return await api.call_api(url, options);
}

/**
 * @description Used to get an Access Token from a Refresh Token
 * @param {string} refresh_token Refresh Token
 * @return {Object} Result of call API
 */
async function getTokken(refresh_token) {
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
  let url = `${api.BASE_URL}/token`;

  return await api.call_api(url, options);
}

/**
 * @description Parse accounts according to desired format
 * @param {string} access_token Access Token
 * @return {Object} Accounts with their transactions
 */
async function before_parse_accounts(access_token) {
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
  let url_accounts = `${api.BASE_URL}/accounts`;
  let url_transactions = `${api.BASE_URL}/accounts/acc_number/transactions`;

  return await api.parse_account(
    (url_base = api.BASE_URL),
    url_accounts,
    url_transactions,
    options
  );
}

/**
 * @description launch formatting the accounts according to the desired format
 * @param {string} username Name of the user
 * @param {string} password Password of the user
 * @param {string} authorization Authorization
 * @return {Object} Accounts with their transactions
 */
async function prepare_parse_accounts(username, password, authorization) {
  let resLogin = await login(username, password, authorization);
  if (resLogin.err) {
    return {
      code: resLogin.code,
      data: { err: resLogin.err },
    };
  }
  let resToken = await getTokken(resLogin.data.refresh_token);
  if (resToken.err) {
    return {
      code: resToken.code,
      data: { err: resToken.err },
    };
  }
  let resParseAccounts = await before_parse_accounts(
    resToken.data.access_token
  );
  if (resParseAccounts.err) {
    return {
      code: resParseAccounts.code,
      data: { err: resParseAccounts.err },
    };
  }
  return {
    code: HttpStatus.OK,
    data: resParseAccounts.data,
  };
}

module.exports = {
  prepare_parse_accounts: prepare_parse_accounts,
};
