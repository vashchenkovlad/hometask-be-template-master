const { clientOrContractor } = require('../helpers/clientOrContractor');
const { Op } = require('sequelize');

const getContractById = async (req) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const { profile } = req;

  return Contract.findOne({
    where: {
      id,
      [Op.or]: clientOrContractor(profile.id),
    },
  });
};

module.exports = { getContractById };
