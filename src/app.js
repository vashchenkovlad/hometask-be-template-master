const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { clientProfileType } = require('./middleware/clientProfileType');
const { adminProfileType } = require('./middleware/adminProfileType');
const controllers = require('./controllers/index');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// global middlewares
app.use(getProfile);

// GET routes

app.get('/contracts/:id', async (req, res) => {
  const contract = await controllers.getContractById(req);

  if (!contract) return res.status(404).end();

  res.json(contract);
});

app.get('/contracts', async (req, res) => {
  const contracts = await controllers.getContracts(req);

  res.json(contracts);
});

app.get('/jobs/unpaid', async (req, res) => {
  const unpaidJobs = await controllers.getUnpaidJobsForActiveContracts(req);

  res.json(unpaidJobs);
});

app.get('/admin/best-profession', adminProfileType, async (req, res) => {
  try {
    const profession = await controllers.getTheHighestPayingJob(req);

    res.json(profession);
  } catch (err) {
    return res.status(err.statusCode).end(err.message);
  }
});

app.get('/admin/best-clients', adminProfileType, async (req, res) => {
  try {
    const clients = await controllers.getTheMostSolventClient(req);

    res.json(clients);
  } catch (err) {
    return res.status(err.statusCode).end(err.message);
  }
});

// POST routes

app.post('/jobs/:jobId/pay', clientProfileType, async (req, res) => {
  try {
    await controllers.payForContractJob(req);

    res.json({ success: true });
  } catch (err) {
    return res.status(err.statusCode).end(err.message);
  }
});

app.post('/balances/deposit/:userId', clientProfileType, async (req, res) => {
  try {
    await controllers.depositMoneyIntoTheBalance(req);

    res.json({ success: true });
  } catch (err) {
    return res.status(err.statusCode).end(err.message);
  }
});

module.exports = app;
