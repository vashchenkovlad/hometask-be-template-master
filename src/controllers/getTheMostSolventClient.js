const { Op } = require('sequelize');
const { PROFILE_TYPES } = require('../consts/index');
const { sequelize } = require('../model');
const {
  extractDateDiapasonFromRequest,
} = require('../helpers/extractDateDiapasonFromRequest');

const getTheMostSolventClient = async (req) => {
  const { Profile, Contract, Job } = req.app.get('models');

  const { dateFrom, dateTo } = extractDateDiapasonFromRequest(req.query);
  const limit = req.query.limit ? req.query.limit : 2;

  return Profile.findAll({
    attributes: [
      [sequelize.fn('sum', sequelize.col('Client.Job.price')), 'paid'],
      'firstName',
      'lastName',
    ],
    include: [
      {
        attributes: [],
        model: Contract,
        as: 'Client',
        include: [
          {
            attributes: [],
            model: Job,
            as: 'Job',
            where: {
              paid: { [Op.not]: null },
              paymentDate: { [Op.between]: [dateFrom, dateTo] },
            },
          },
        ],
      },
    ],
    where: {
      type: PROFILE_TYPES.CLIENT,
    },
    group: ['Profile.id'],
    order: [['paid', 'DESC']],
    raw: true,
    subQuery: false,
    limit,
  });
};

module.exports = { getTheMostSolventClient };
