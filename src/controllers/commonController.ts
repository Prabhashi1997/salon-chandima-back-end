import ControllerBase from '../common/ControllerBase';
import { Post, Request, Route, Security } from 'tsoa';
import { Responses } from '../Response';
import express from 'express';
import multer from 'multer';
import * as fs from 'fs';
import Configs from '../common/Configs';

@Route('api/v1/common')
export class CommonController extends ControllerBase {
  // 1.2.0
  @Security('jwt', ['admin', 'user', 'hr', 'manger'])
  @Post('uploadFile')
  public async uploadFile(@Request() request: any): Promise<any> {
    return this.exec(async () => {
      await this.handleFile(request);
      const ext = request?.file?.originalname.split('.').reverse()[0].toLowerCase();
      if (request?.file.mimetype.match(/^image/) && (ext === 'jpg' || ext === 'png')) {
        const uniqueId = Date.now();
        fs.mkdirSync(`${Configs.uploadPath}/${uniqueId}`, { recursive: true });
        fs.writeFileSync(`${Configs.uploadPath}/${uniqueId}/${request?.file?.originalname}`, request.file.buffer, {});
        //  file will be in request.randomFileIsHere, it is a buffer
        return Responses.ok({ path: `/${uniqueId}/${request.file.originalname}` });
      } else {
        return Responses.forbidden();
      }
    });
  }

  private handleFile(request: express.Request): Promise<any> {
    const multerSingle = multer().single('file');
    return new Promise((resolve, reject) => {
      multerSingle(request, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve(undefined);
      });
    });
  }
}
