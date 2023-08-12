import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  async use(req: Request, res: Response, next: NextFunction) {

    const authToken = req.headers.authorization?.split(' ')[1];
    try {
      const validAuthToken = jwt.verify(authToken, "jwtSecret");
      if (validAuthToken) {
        next();
      } else {
        throw new UnauthorizedException("The User has been Logged Out");
      }
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
