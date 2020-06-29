const getRepositoriesStarsByOrg = async (req, res, next) => {
  try {
    const data = [];
    return res.json(data);
  } catch (error) {
    console.error(error);
    return next();
  }
};

module.exports = { getRepositoriesStarsByOrg };
