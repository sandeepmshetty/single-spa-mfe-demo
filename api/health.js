module.exports = async (req, res) => {
  return res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      auth: 'healthy',
      errors: 'healthy'
    }
  });
};
