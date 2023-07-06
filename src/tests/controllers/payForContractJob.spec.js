const Sequelize = require('sequelize');
const { payForContractJob } = require('../../controllers/payForContractJob');
const { Profile, Contract, Job, sequelize } = require('../../model');
const updateProfileBalanceModule = require('../../helpers/updateProfileBalance');

describe('Testing', () => {
  let mockedSequelize;
  let mockRequest;

  const VALID_AMOUNT = 200;

  const job = {
    id: 1,
    price: 250,
    paid: null,
    ClientId: 'test_id',
    ContractorId: 'test_case',
  };

  const profile = {
    id: 1,
    balance: 100,
    firstName: 'Test',
    lastName: 'Case',
  };

  const rollbackSpy = jest.fn();
  const commitSpy = jest.fn();

  beforeEach(async () => {
    mockedSequelize = new Sequelize({
      dialect: 'sqlite',
      query: { raw: true },
    });

    mockRequest = {
      app: {
        get: (val) => ({ Profile, Contract, Job }),
      },
      params: {
        jobId: 'test_job_id',
      },
      body: {
        amount: '',
      },
      profile: {
        id: 'test_profile_id',
      },
    };

    sequelize.transaction = jest.fn(() => ({
      rollback: rollbackSpy,
      commit: commitSpy,
      LOCK: {
        UPDATE: 'update',
      },
    }));

    await mockedSequelize.sync({ force: true });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mockedSequelize.close();
  });

  test('it should throw error if invalid value was passed as "amout",.', async () => {
    await expect(payForContractJob(mockRequest)).rejects.toThrow(
      'Invalid amount was sent'
    );
  });

  test('it should throw error if negative "amount" was passed.', async () => {
    mockRequest.body.amount = '-32';

    await expect(payForContractJob(mockRequest)).rejects.toThrow(
      'Invalid amount was sent!'
    );
  });

  test('it should throw error if "Job" was not found.', async () => {
    mockRequest.body.amount = VALID_AMOUNT;

    const findOneJobSpy = jest.spyOn(Job, 'findOne');
    findOneJobSpy.mockImplementation(() => null);

    await expect(payForContractJob(mockRequest)).rejects.toThrow(
      'Job was not found!'
    );
  });

  test('it should throw error if "Profile" balance is less than "amount".', async () => {
    mockRequest.body.amount = VALID_AMOUNT;

    const findOneJobSpy = jest.spyOn(Job, 'findOne');
    findOneJobSpy.mockImplementation(() => job);

    const findOneProfileSpy = jest.spyOn(Profile, 'findOne');
    findOneProfileSpy.mockImplementation(() => profile);

    await expect(payForContractJob(mockRequest)).rejects.toThrow(
      'You balance is lower than job price!'
    );

    expect(rollbackSpy).toHaveBeenCalled();
  });

  // TODO: Add final test
});
