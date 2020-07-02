const check = (req, res) => {
  res.json([{ source: 'server', status: 'health', date: new Date() }]);
};

module.exports = { check };
