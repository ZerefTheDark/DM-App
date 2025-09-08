export default class ChatWindow {
  constructor(container) {
    this.container = container;
    this.initUI();
  }

  initUI() {
    this.container.innerHTML = `
      <h2>Chat Window</h2>
      <div id="chat-messages"></div>
      <input type="text" id="chat-input" placeholder="Type your message here">
      <button id="send-message">Send</button>
    `;

    this.initEventListeners();
  }

  initEventListeners() {
    this.container.querySelector('#send-message').addEventListener('click', this.sendMessage.bind(this));
  }

  sendMessage() {
    const message = this.container.querySelector('#chat-input').value;
    if (message) {
      const messageElement = document.createElement('div');
      messageElement.innerText = message;
      this.container.querySelector('#chat-messages').appendChild(messageElement);
      this.container.querySelector('#chat-input').value = '';
    }
  }
}