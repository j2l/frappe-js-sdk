import { FrappeAuth } from '../auth/index.js';
import { FrappeCall } from '../call/index.js';
import { FrappeDB } from '../db/index.js';
import { FrappeFileUpload } from '../file/index.js';
import { getRequestHeaders } from '../utils/fetch.js';

export class FrappeApp {
  constructor(url, tokenParams = {}, name, customHeaders) {
    this.url = url;
    this.name = name ?? 'FrappeApp';
    this.useToken = tokenParams?.useToken ?? false;
    this.token = tokenParams?.token;
    this.tokenType = tokenParams?.type ?? 'Bearer';
    this.customHeaders = customHeaders;
    this.headers = getRequestHeaders(this.useToken, this.tokenType, this.token, this.url, this.customHeaders);
  }

  auth() {
    return new FrappeAuth(this.url, this.headers);
  }

  db() {
    return new FrappeDB(this.url, this.headers);
  }

  file() {
    return new FrappeFileUpload(this.url, this.headers);
  }

  call() {
    return new FrappeCall(this.url, this.headers);
  }
}
