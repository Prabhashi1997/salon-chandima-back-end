import express, { Response as ExResponse } from 'express';
import { RegisterRoutes } from '../generated/routes';
import { DatabaseService } from './service/database';

import cors from 'cors';
import Configs from './common/Configs';
import * as fs from 'fs';
export const app = express();


app.use('/files', (req, res) => {
  const path = decodeURI(req.path);
  if (path.indexOf('../') === -1 && fs.existsSync(`${Configs.uploadPath}${path}`)) {
    res.download(`${Configs.uploadPath}${path}`);
  } else {
    res.status(404);
    res.end();
  }
});

// Use body parser to read sent json payloads

//  app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(cors({ origin: true }));

DatabaseService.getInstance().connect();

RegisterRoutes(app);


app.use(function (req, res, next) {
  if (!('JSONResponse' in res)) {
    return next();
  }
  res.set('Cache-Control', 'private');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return next();
});

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: 'Not Found',
  });
});
