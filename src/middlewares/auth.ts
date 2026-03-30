import { Request, Response, NextFunction } from 'express';
import TokenRepository from '../repositories/tokenRepository';

export default async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const [, token] = authToken.split(' ');
    
    const decoded = TokenRepository.verifyAccessToken(token) as { id: string, role: string };
    
    req.user = { id: decoded.id, role: decoded.role };
    
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}