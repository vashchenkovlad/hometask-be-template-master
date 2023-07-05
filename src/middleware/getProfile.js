const { API_HEADERS } = require('../consts/index');

const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get('models');

  const profileId = req.get(API_HEADERS.AUTH);

  if (!profileId) {
    return res.status(403).json({ error: 'No credentials sent!' }).end();
  }

  const parsedProfileId = Number(profileId);

  if (isNaN(parsedProfileId)) {
    return res
      .status(401)
      .json({ error: 'Invalid credentials were sent!' })
      .end();
  }

  const profile = await Profile.findOne({
    where: { id: parsedProfileId },
  });

  if (!profile) return res.status(401).end();

  req.profile = profile;

  next();
};
module.exports = { getProfile };
