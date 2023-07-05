const { Op } = require('sequelize');
const { PROFILE_TYPES } = require('../consts/index');
const { sequelize } = require('../model');
const { HttpError } = require('../helpers/httpError');
const {
  extractDateDiapasonFromRequest,
} = require('../helpers/extractDateDiapasonFromRequest');

const getTheHighestPayingJob = async (req) => {
  const { Profile, Contract, Job } = req.app.get('models');

  const { dateFrom, dateTo } = extractDateDiapasonFromRequest(req.query);

  const job = await Profile.findOne({
    attributes: [
      [sequelize.fn('sum', sequelize.col('Contractor.Job.price')), 'total'],
      'profession',
    ],
    include: [
      {
        attributes: [],
        model: Contract,
        as: 'Contractor',
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
      type: PROFILE_TYPES.CONTRACTOR,
    },
    group: ['profession'],
    order: [['total', 'DESC']],
    raw: true,
    subQuery: false,
  });

  if (!job.total) {
    throw new HttpError(
      'No information was found for this period! Try another dates!',
      404
    );
  }

  return job;
};

module.exports = { getTheHighestPayingJob };
