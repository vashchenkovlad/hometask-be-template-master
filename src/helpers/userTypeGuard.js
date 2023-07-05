const { HttpError } = require('../helpers/httpError');

const userTypeGuard = (profileType, expectedProfileType) => {
  if (profileType !== expectedProfileType) {
    throw new HttpError(
      `Only users with type: '${expectedProfileType}' can perform this operation!`,
      403
    );
  }

  return true;
};
module.exports = { userTypeGuard };
