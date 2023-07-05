const { Op } = require('sequelize');
const { HttpError } = require('../helpers/httpError');
const { clientOrContractor } = require('../helpers/clientOrContractor');
const { updateProfileBalance } = require('../helpers/updateProfileBalance');
const { OPERATION_TYPES } = require('../consts/index');
const { sequelize } = require('../model');

const payForContractJob = async (req) => {
  const { Job, Profile, Contract } = req.app.get('models');
  const { jobId } = req.params;
  const { amount } = req.body;

  const jobPrice = Number(amount);

  if (amount === '' || jobPrice < 0) {
    throw new HttpError('Invalid amount was sent', 400);
  }

  const unpaidJob = await Job.findOne({
    attributes: ['Job.*', 'Contract.ClientId', 'Contract.ContractorId'],
    include: [
      {
        attributes: [],
        model: Contract,
        as: 'Contract',
        where: {
          [Op.or]: clientOrContractor(req.profile.id),
          // QUESTION: Should I add a `Contract`.`status` check???
        },
        required: true,
      },
    ],
    where: {
      id: jobId,
      paid: { [Op.eq]: null },
    },
    raw: true,
  });

  if (!unpaidJob) {
    throw new HttpError('Job was not found', 404);
  }

  const t = await sequelize.transaction();

  try {
    const { id, ClientId, ContractorId } = unpaidJob;

    const clientProfile = await Profile.findOne({ where: { id: ClientId } });

    if (clientProfile.balance < jobPrice) {
      throw new HttpError('You balance is lower than job price!', 400);
    }

    await updateProfileBalance(ClientId, jobPrice, OPERATION_TYPES.DECREASE, t);

    await updateProfileBalance(
      ContractorId,
      jobPrice,
      OPERATION_TYPES.INCREASE,
      t
    );

    await Job.findOne({ where: { id }, raw: false }).then((paidJob) => {
      return paidJob.update(
        { paid: true, paymentDate: new Date() },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    });

    // QUESTION: Should I change a contract status?

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw new HttpError(err, 500);
  }
};

module.exports = { payForContractJob };
