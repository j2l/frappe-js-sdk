export class FrappeFileUpload {
  constructor(appURL, headers) {
    this.appURL = appURL;
    this.headers = headers;
  }

  async uploadFile(file, args, onProgress, apiPath = 'upload_file') {
    const formData = new FormData();
    if (file) formData.append('file', file, file.name);

    const { isPrivate, folder, file_url, doctype, docname, fieldname, otherData } = args;

    if (isPrivate) {
      formData.append('is_private', '1');
    }
    if (folder) {
      formData.append('folder', folder);
    }
    if (file_url) {
      formData.append('file_url', file_url);
    }
    if (doctype && docname) {
      formData.append('doctype', doctype);
      formData.append('docname', docname);
      if (fieldname) {
        formData.append('fieldname', fieldname);
      }
    }

    if (otherData) {
      Object.keys(otherData).forEach((key) => {
        formData.append(key, otherData[key]);
      });
    }

    const response = await fetch(`${this.appURL}/api/method/${apiPath}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        ...error,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        message: error.message ?? 'There was an error while uploading the file.',
        exception: error.exception ?? ''
      };
    }

    return response.json();
  }
}
