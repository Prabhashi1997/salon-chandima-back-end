export interface ErrorJson {
  code: string;
  message: string;
  body?: any;
}

export interface SuccessJson {
  code: string;
  body?: any;
}

export interface ServiceResponseJson {
  statusCode: number;
  body: {
    code: string;
    message?: string;
    body?: any;
  };
}

export interface ResponseJson {
  code: string;
  message?: string;
  body?: any;
}
