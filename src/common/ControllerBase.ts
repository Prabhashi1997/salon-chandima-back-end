import { Controller } from '@tsoa/runtime';
import { ControllerResponse, ServiceError } from '../Response';
import Utils from './Utils';

export default class ControllerBase extends Controller {
  public exec = <T extends any = any>(
    runner: () => Promise<ControllerResponse<T>>,
  ): Promise<T | { message: string; body?: any }> => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;
    return new Promise<T>((resolve, reject) => {
      runner()
        .then((value) => {
          me.setStatus(value.statusCode);
          const body = value.body ? Utils.removeNull(value.body) : undefined;
          resolve(body);
        })
        .catch((err) => {
          if (err instanceof ServiceError) {
            const e: ServiceError = err;
            me.setStatus(e.code);
            const errBody: any = { message: err.msg, body: err.body };
            resolve(errBody);
          } else {
            reject(err);
          }
        });
    });
  };
}
