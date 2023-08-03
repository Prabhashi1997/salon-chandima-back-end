import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Common } from './entity/Common';
import { DatabaseService } from './service/database';
import { Algorithm } from 'jsonwebtoken';

export const expressAuthentication = (
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> => {
  if (securityName === 'jwt') {
    return new Promise(async (resolve, reject) => {
      if (request.headers['authorization'] === '' || request.headers['authorization'] === undefined) {
        reject(new ReferenceError('No token provided'));
      }
      const token = request.headers['authorization']?.split('Bearer ')[1];
      if (!token) {
        reject(new ReferenceError('No token provided'));
      }
      const verifyOptions = {
        issuer: 'salon-chandima',
        subject: 'user',
        audience: 'http://localhost:4200',
        maxAge: '58365h',
        algorithms: ['RS256'] as Algorithm[],
      };

      const key = await DatabaseService.getInstance()
        .getRepository(Common)
        .findOne({ where: { key: 'publicKey' } });
      jwt.verify(token, key.val, verifyOptions, (err: any, decoded: any) => {
        if (err) {
          reject(new ReferenceError(err));
        } else {
          // Check if JWT contains one of required scopes
          console.log(decoded.role, scopes);
          if (decoded.role.filter((e) => scopes.indexOf(e) !== -1).length === 0) {
            reject(new ReferenceError('JWT does not contain required scope.'));
          }
          resolve(decoded);
        }
      });
    });
  }
};
