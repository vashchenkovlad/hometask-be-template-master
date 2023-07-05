const { Profile } = require('../model');
const { OPERATION_TYPES } = require('../consts/index');

const calculateBalance = (balance, amount, operationType) =>
  OPERATION_TYPES.INCREASE === operationType
    ? (balance += amount)
    : (balance -= amount);

const updateProfileBalance = async (profileId, amount, operationType, t) => {
  return Profile.findOne({ where: { id: profileId }, raw: false }).then(
    (profile) => {
      return profile.update(
        { balance: calculateBalance(profile.balance, amount, operationType) },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }
  );
};

module.exports = { updateProfileBalance };
