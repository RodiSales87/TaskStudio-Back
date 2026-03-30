import jwt, { SignOptions } from 'jsonwebtoken';

class TokenRepository {
  generateAccessToken(id: string, role: string, expiresIn: string) {
    const options: SignOptions = { expiresIn: expiresIn as any };
    
    const generatedToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET as string, options);
    
    return generatedToken;
  }

  generateRefreshToken(id: string, expiresIn: string) {
    const options: SignOptions = { expiresIn: expiresIn as any };
    
    const generatedToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, options);

    return generatedToken;
  }

  verifyAccessToken(token: string): jwt.JwtPayload {
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as jwt.JwtPayload;

    return verifiedToken;
  }

  verifyRefreshToken(token: string): jwt.JwtPayload {
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as jwt.JwtPayload;

    return verifiedToken;
  }
}

export default new TokenRepository();
