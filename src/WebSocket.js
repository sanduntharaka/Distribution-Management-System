class WebSocketInstance {
  constructor(routeName) {
    this.routeName = routeName;
    this.socket = null;
    this.callbacks = [];
  }

  connect() {
    this.socket = new WebSocket(`ws://main.bixtonlighting.com/ws/daily_status/${this.routeName}/`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.callbacks.forEach(callback => callback(data));
    };
  }

  addCallback(callback) {
    this.callbacks.push(callback);
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default WebSocketInstance;