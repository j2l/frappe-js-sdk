export function getRequestHeaders(useToken = false, tokenType, token, appURL, customHeaders = {}) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (useToken && tokenType && token) {
    headers.Authorization = `${tokenType} ${token()}`;
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (window.location) {
      if (appURL && appURL !== window.location.origin) {
        // Do not set X-Frappe-Site-Name
      } else {
        headers['X-Frappe-Site-Name'] = window.location.hostname;
      }
    }
    if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = window.csrf_token;
    }
  }

  return { ...headers, ...customHeaders };
}

export async function fetchWrapper(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      ...error,
      httpStatus: response.status,
      httpStatusText: response.statusText,
      message: error.message ?? 'An error occurred',
      exception: error.exception ?? error.exc_type ?? ''
    };
  }

  return response.json();
}
