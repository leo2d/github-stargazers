const {
  getRepositoriesInfoByOrg,
} = require('../../services/repositoriesService');

const getRepositoriesStarsByOrg = async (req, res, next) => {
  try {
    const data = await getRepositoriesInfoByOrg(req.params.name);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return next();
  }
};

module.exports = { getRepositoriesStarsByOrg };
