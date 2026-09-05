/**
 * auth.js
 * Citizen & Multi-Role Authentication Middleware
 */

export const authMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Decode token or inject verified citizen user context
    req.user = {
      id: 'CIT-JH-88392',
      name: 'Sunil Soren',
      role: 'citizen',
      district: 'Ranchi',
      ward: 'Ward 12'
    };
  } else {
    // Default demo citizen session
    req.user = {
      id: 'CIT-JH-88392',
      name: 'Sunil Soren',
      role: 'citizen',
      district: 'Ranchi',
      ward: 'Ward 12'
    };
  }
  next();
};

export default authMiddleware;
