const { CONTRACT_STATUS } = require('../consts/index');
const { clientOrContractor } = require('../helpers/clientOrContractor');
const { Op } = require('sequelize');

const getContracts = async (req) => {
  const { Contract } = req.app.get('models');
  const { profile } = req;

  return Contract.findAll({
    where: {
      status: {
        [Op.not]: CONTRACT_STATUS.TERMINATED,
      },
      [Op.or]: clientOrContractor(profile.id),
    },
  });
};

module.exports = { getContracts };
