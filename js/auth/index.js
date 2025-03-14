import { fetchWrapper } from '../utils/fetch.js';

export class FrappeAuth {
  constructor(appURL, headers) {
    this.appURL = appURL;
    this.headers = headers;
  }

  async loginWithUsernamePassword(credentials) {
    return fetchWrapper(`${this.appURL}/api/method/login`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        usr: credentials.username,
        pwd: credentials.password,
        otp: credentials.otp,
        tmp_id: credentials.tmp_id,
        device: credentials.device,
      })
    });
  }

  async getLoggedInUser() {
    const response = await fetchWrapper(`${this.appURL}/api/method/frappe.auth.get_logged_user`, {
      headers: this.headers
    });
    return response.message;
  }

  async logout() {
    await fetchWrapper(`${this.appURL}/api/method/logout`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({})
    });
  }

  async forgetPassword(user) {
    await fetchWrapper(`${this.appURL}/`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        cmd: 'frappe.core.doctype.user.user.reset_password',
        user,
      })
    });
  }
}
