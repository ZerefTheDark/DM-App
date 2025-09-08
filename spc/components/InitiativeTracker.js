export default class InitiativeTracker {
  constructor(container) {
    this.container = container;
    this.initUI();
  }

  initUI() {
    this.container.innerHTML = `
      <h2>Initiative Tracker</h2>
      <input type="text" id="character-name" placeholder="Character Name">
      <input type="number" id="initiative" placeholder="Initiative">
      <button id="add-character">Add Character</button>
      <ul id="initiative-list"></ul>
    `;

    this.initEventListeners();
  }

  initEventListeners() {
    this.container.querySelector('#add-character').addEventListener('click', this.addCharacter.bind(this));
  }

  addCharacter() {
    const name = this.container.querySelector('#character-name').value;
    const initiative = this.container.querySelector('#initiative').value;
    if (name && initiative) {
      const listItem = document.createElement('li');
      listItem.innerText = `${name}: ${initiative}`;
      this.container.querySelector('#initiative-list').appendChild(listItem);
      this.container.querySelector('#character-name').value = '';
      this.container.querySelector('#initiative').value = '';
    }
  }
}