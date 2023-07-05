const moment = require('moment');

const extractDateDiapasonFromRequest = (query) => {
  const { start, end } = query;

  const now = moment();
  const dateFrom = start ? start : now.format('YYYY/MM/DD');
  const dateTo = end ? end : now.add(1, 'week').format('YYYY/MM/DD');

  return { dateFrom, dateTo };
};

module.exports = { extractDateDiapasonFromRequest };
