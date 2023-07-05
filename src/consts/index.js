const API_HEADERS = {
  AUTH: 'profile_id',
};

const PROFILE_TYPES = {
  CLIENT: 'client',
  CONTRACTOR: 'contractor',
  ADMIN: 'admin',
};

const CONTRACT_STATUS = {
  TERMINATED: 'terminated',
  IN_PROGRESS: 'in_progress',
  NEW: 'new',
};

const OPERATION_TYPES = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
};

const ALLOWED_PERCENTAGE_FOR_DEPOSITS = 25;

module.exports = {
  API_HEADERS,
  CONTRACT_STATUS,
  PROFILE_TYPES,
  OPERATION_TYPES,
  ALLOWED_PERCENTAGE_FOR_DEPOSITS,
};
