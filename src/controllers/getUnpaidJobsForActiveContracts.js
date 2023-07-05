const { CONTRACT_STATUS } = require('../consts/index');
const { clientOrContractor } = require('../helpers/clientOrContractor');
const { Op } = require('sequelize');

const getUnpaidJobsForActiveContracts = async (req) => {
  const { Job, Contract } = req.app.get('models');
  const { profile } = req;

  return Contract.findAll({
    attributes: ['Job.*'],
    include: [
      {
        attributes: [],
        model: Job,
        as: 'Job',
        required: true,
      },
    ],
    where: {
      status: { [Op.eq]: CONTRACT_STATUS.IN_PROGRESS },
      '$Job.paid$': { [Op.eq]: null },
      [Op.or]: clientOrContractor(profile.id),
    },
    raw: true,
  });
};

module.exports = { getUnpaidJobsForActiveContracts };
