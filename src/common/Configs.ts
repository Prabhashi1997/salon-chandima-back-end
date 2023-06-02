import dotenv from 'dotenv';

export default class Configs {
  static uploadPath = '.';
  static load() {
    dotenv.config();
    Configs.uploadPath = process.env.UPLOAD_PATH ?? `${__dirname}/../../upload`;
  }
}
