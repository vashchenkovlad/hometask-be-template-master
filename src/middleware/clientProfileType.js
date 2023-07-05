const { PROFILE_TYPES } = require('../consts/index');
const { userTypeGuard } = require('../helpers/userTypeGuard');

const clientProfileType = (req, res, next) => {
  const { profile } = req;

  try {
    userTypeGuard(profile.type, PROFILE_TYPES.CLIENT);

    next();
  } catch (err) {
    return res.status(err.statusCode).json({ error: err.message }).end();
  }
};
module.exports = { clientProfileType };
