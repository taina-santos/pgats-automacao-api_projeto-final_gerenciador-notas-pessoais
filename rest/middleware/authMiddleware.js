const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso requerido.' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
}

function generateToken(user) {
  return jwt.sign(
    { username: user.username },
    SECRET,
    { expiresIn: '1h' }
  );
}

module.exports = { authenticateJWT, generateToken, SECRET };
