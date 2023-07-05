const { getContracts } = require('./getContracts');
const { getContractById } = require('./getContractById');
const {
  getUnpaidJobsForActiveContracts,
} = require('./getUnpaidJobsForActiveContracts');
const { payForContractJob } = require('./payForContractJob');
const { depositMoneyIntoTheBalance } = require('./depositMoneyIntoTheBalance');
const { getTheHighestPayingJob } = require('./getTheHighestPayingJob');
const { getTheMostSolventClient } = require('./getTheMostSolventClient');

module.exports = {
  getContracts,
  getContractById,
  getUnpaidJobsForActiveContracts,
  payForContractJob,
  depositMoneyIntoTheBalance,
  getTheHighestPayingJob,
  getTheMostSolventClient,
};
