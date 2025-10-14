module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const mockUser = {
    id: '1',
    email,
    name: email.split('@')[0],
    roles: ['user'],
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
      timezone: 'UTC'
    }
  };

  const token = Buffer.from(JSON.stringify({ userId: mockUser.id, exp: Date.now() + 86400000 })).toString('base64');
  const refreshToken = Buffer.from(JSON.stringify({ userId: mockUser.id, type: 'refresh' })).toString('base64');

  return res.status(200).json({
    success: true,
    user: mockUser,
    token,
    refreshToken,
    expiresAt: Date.now() + 86400000
  });
};
