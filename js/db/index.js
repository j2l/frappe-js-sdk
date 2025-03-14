import { fetchWrapper } from '../utils/fetch.js';

export class FrappeDB {
  constructor(appURL, headers) {
    this.appURL = appURL;
    this.headers = headers;
  }

  async getDoc(doctype, docname = '') {
    const response = await fetchWrapper(`${this.appURL}/api/resource/${doctype}/${encodeURIComponent(docname)}`, {
      headers: this.headers
    });
    return response.data;
  }

  async getDocList(doctype, args) {
    let params = new URLSearchParams();

    if (args) {
      const { fields, filters, orFilters, orderBy, limit, limit_start, groupBy, asDict = true } = args;
      if (fields) params.set('fields', JSON.stringify(fields));
      if (filters) params.set('filters', JSON.stringify(filters));
      if (orFilters) params.set('or_filters', JSON.stringify(orFilters));
      if (orderBy) params.set('order_by', `${orderBy.field} ${orderBy.order ?? 'asc'}`);
      if (groupBy) params.set('group_by', groupBy);
      if (limit) params.set('limit', limit);
      if (limit_start) params.set('limit_start', limit_start);
      params.set('as_dict', asDict);
    }

    const response = await fetchWrapper(`${this.appURL}/api/resource/${doctype}?${params}`, {
      headers: this.headers
    });
    return response.data;
  }

  async createDoc(doctype, value) {
    const response = await fetchWrapper(`${this.appURL}/api/resource/${doctype}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(value)
    });
    return response.data;
  }

  async updateDoc(doctype, docname, value) {
    const response = await fetchWrapper(`${this.appURL}/api/resource/${doctype}/${encodeURIComponent(docname)}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(value)
    });
    return response.data;
  }

  async deleteDoc(doctype, docname) {
    const response = await fetchWrapper(`${this.appURL}/api/resource/${doctype}/${encodeURIComponent(docname)}`, {
      method: 'DELETE',
      headers: this.headers
    });
    return response.data;
  }

  async getCount(doctype, filters, cache = false, debug = false) {
    let params = new URLSearchParams();
    params.set('doctype', doctype);
    if (filters) params.set('filters', JSON.stringify(filters));
    if (cache) params.set('cache', cache);
    if (debug) params.set('debug', debug);

    const response = await fetchWrapper(`${this.appURL}/api/method/frappe.client.get_count?${params}`, {
      headers: this.headers
    });
    return response.message;
  }

  async getLastDoc(doctype, args) {
    let queryArgs = {
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    };
    if (args) {
      queryArgs = {
        ...queryArgs,
        ...args,
      };
    }

    const getDocLists = await this.getDocList(doctype, { ...queryArgs, limit: 1, fields: ['name'] });
    if (getDocLists.length > 0) {
      return this.getDoc(doctype, getDocLists[0].name);
    }

    return {};
  }
}
