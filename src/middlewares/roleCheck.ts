import { Request, Response, NextFunction } from 'express';

export function roleCheck(rolesAllowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !rolesAllowed.includes(userRole)) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão.' });
    }

    next();
  };
}