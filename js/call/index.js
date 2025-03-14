import { fetchWrapper } from '../utils/fetch.js';

export class FrappeCall {
  constructor(appURL, headers) {
    this.appURL = appURL;
    this.headers = headers;
  }

  async get(path, params) {
    const encodedParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(param => {
        const [key, value] = param;
        if (value !== null && value !== undefined) {
          const val = typeof value === 'object' ? JSON.stringify(value) : value;
          encodedParams.set(key, val);
        }
      })
    }

    return fetchWrapper(`${this.appURL}/api/method/${path}?${encodedParams}`, {
      headers: this.headers
    });
  }

  async post(path, params) {
    return fetchWrapper(`${this.appURL}/api/method/${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(params)
    });
  }

  async put(path, params) {
    return fetchWrapper(`${this.appURL}/api/method/${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(params)
    });
  }

  async delete(path, params) {
    const encodedParams = new URLSearchParams(params);
    return fetchWrapper(`${this.appURL}/api/method/${path}?${encodedParams}`, {
      method: 'DELETE',
      headers: this.headers
    });
  }
}
