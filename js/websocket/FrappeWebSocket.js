export class FrappeWebSocket {
  constructor() {
    this.socket = null;
    this.messageCallbacks = new Map();
  }

  connect(url) {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => this.handleMessage(event);
    this.socket.onclose = () => {
      setTimeout(() => this.connect(url), 1000);
    };
  }

  handleMessage(event) {
    const data = JSON.parse(event.data);
    const doctype = data?.doctype;
    if (doctype && this.messageCallbacks.has(doctype)) {
      this.messageCallbacks.get(doctype).forEach(callback => callback(data));
    }
  }

  subscribe(doctype, callback) {
    if (!this.messageCallbacks.has(doctype)) {
      this.messageCallbacks.set(doctype, []);
    }
    this.messageCallbacks.get(doctype).push(callback);

    return () => this.unsubscribe(doctype, callback);
  }

  unsubscribe(doctype, callback) {
    const callbacks = this.messageCallbacks.get(doctype) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  getState() {
    return this.socket?.readyState ?? 3;
  }
}
