const { ALLOWED_PERCENTAGE_FOR_DEPOSITS } = require('../consts/index');

const getDepositLimit = (summ) => {
  const allowedDepositLimit = (summ / 100) * ALLOWED_PERCENTAGE_FOR_DEPOSITS;

  return Math.round(allowedDepositLimit * 100) / 100;
};

module.exports = { getDepositLimit };
