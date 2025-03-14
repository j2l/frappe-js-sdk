import { io } from "socket.io-client";

export class WebSocketClient {
  constructor({ url, options = {} }) {
    this.url = url;
    this.socket = io(this.url, {
      withCredentials: true,
      autoConnect: false,
      ...options,
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  subscribe(event, callback) {
    this.socket.on(event, callback);
  }

  unsubscribe(event) {
    this.socket.off(event);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }
}