const { updateProfileBalance } = require('../helpers/updateProfileBalance');
const { HttpError } = require('../helpers/httpError');
const { sequelize } = require('../model');
const { Op } = require('sequelize');
const { OPERATION_TYPES } = require('../consts/index');
const { CONTRACT_STATUS } = require('../consts/index');
const { getDepositLimit } = require('../helpers/getDepositLimit');

const depositMoneyIntoTheBalance = async (req) => {
  const { Contract, Job } = req.app.get('models');
  const { amount } = req.body;
  const { userId } = req.params;

  const parsedAmount = Number(amount);

  if (amount === '' || parsedAmount <= 0) {
    throw new HttpError('Invalid amount was sent', 400);
  }

  const t = await sequelize.transaction();

  try {
    const summToPayForJobs = await Contract.findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('Job.price')), 'total']],
      include: [
        {
          attributes: [],
          model: Job,
          as: 'Job',
          required: true,
        },
      ],
      where: {
        // QUESTION: should this piece of logic work with all contract statuses.
        status: { [Op.eq]: CONTRACT_STATUS.IN_PROGRESS },
        '$Job.paid$': { [Op.eq]: null },
        ClientId: userId,
      },
      raw: true,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const roundedDepostLimit = getDepositLimit(summToPayForJobs[0].total);

    if (roundedDepostLimit !== 0 && parsedAmount > roundedDepostLimit) {
      throw new HttpError(
        // TODO: To think about short and consistent error message.
        `You can't renew your balance, more than the 25% of summ which you have to pay for unpaid jobs!`,
        500
      );
    }
    await updateProfileBalance(
      userId,
      parsedAmount,
      OPERATION_TYPES.INCREASE,
      t
    );

    await await t.commit();
  } catch (err) {
    await t.rollback();
    throw new HttpError(err, 500);
  }
};

module.exports = { depositMoneyIntoTheBalance };
