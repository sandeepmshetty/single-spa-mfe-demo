module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  const newToken = Buffer.from(JSON.stringify({ userId: '1', exp: Date.now() + 86400000 })).toString('base64');

  return res.status(200).json({
    success: true,
    token: newToken,
    expiresAt: Date.now() + 86400000
  });
};
