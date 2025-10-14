module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, stack, source, severity, timestamp } = req.body;

  console.error('[ERROR LOG]', {
    message,
    stack,
    source,
    severity,
    timestamp: timestamp || new Date().toISOString()
  });

  return res.status(200).json({ success: true, logged: true });
};
