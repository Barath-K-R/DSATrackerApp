import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET; 

export const authMiddleware = (req, res, next) => {
    console.log('verifying token');
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Bearer token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);


    req.user = {
      id: decoded.userId,
      username: decoded.username,
    };

    next(); 
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
