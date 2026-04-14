import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.js';

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
    return next();
  };
}
