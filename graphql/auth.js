const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

function getUserFromToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });
}

module.exports = { getUserFromToken, generateToken, SECRET };