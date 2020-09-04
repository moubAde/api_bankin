const fetch = require("node-fetch");
const HttpStatus = require("http-status-codes");

/**
 * @description Call API
 * @param {string} url The route to call in the API
 * @param {Object} options The options used for the call API
 * @return {Object} Result of call API
 */
async function call_api(url, options) {
  const response = await fetch(url, options);
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    if (process.env.TEST_LOCAL !== "yes") console.log("error=>", error);
  }
  return {
    code: response.status,
    err: response.ok ? null : response.statusText,
    data: data,
  };
}

/**
 * @description Parse accounts according to desired format
 * @param {string} url_base The API URL
 * @param {string} url_accounts the url to get accounts
 * @param {string} url_transactions the url to obtain the transactions of an account
 * @param {Object} options The options used for the call API
 * @return {Object} Accounts with their transactions
 */
async function parse_account(
  url_base,
  url_accounts,
  url_transactions,
  options
) {
  let ret = [];
  let accounts_processed = [];
  let response_accounts;
  do {
    response_accounts = await this.call_api(
      response_accounts && response_accounts.data
        ? url_base + response_accounts.data.link.next
        : url_accounts,
      options
    );
    if (response_accounts.err) {
      return {
        code: response_accounts.status,
        err: response_accounts.err,
        data: [],
      };
    }

    for (account of response_accounts.data.account) {
      if (!accounts_processed.includes(account.acc_number)) {
        accounts_processed.push(account.acc_number);
        let format_account = {
          acc_number: account.acc_number,
          amount: account.amount,
          transactions: [],
        };

        let transaction_processed = [];
        let response_transactions;
        do {
          response_transactions = await this.call_api(
            response_transactions && response_transactions.data
              ? url_base + response_transactions.data.link.next
              : url_transactions.replace("acc_number", account.acc_number),
            options
          );

          let format_transaction = [];
          if (!response_transactions.err) {
            for (transaction of response_transactions.data.transactions) {
              if (!transaction_processed.includes(transaction.id)) {
                transaction_processed.push(transaction.id);
                format_transaction.push({
                  label: transaction.label,
                  amount: transaction.amount,
                  currency: transaction.currency,
                });
              }
            }
          }
          format_account.transactions.push(...format_transaction);
        } while (
          response_transactions.data &&
          response_transactions.data.link &&
          response_transactions.data.link.next
        );
        ret.push(format_account);
      }
    }
  } while (response_accounts.data && response_accounts.data.link.next);

  return {
    code: HttpStatus.OK,
    err: null,
    data: ret,
  };
}

module.exports = {
  BASE_URL: "http://127.0.0.1:3000",
  call_api: call_api,
  parse_account: parse_account,
};
