import dice from '../utils/dice.js';

export default class DiceRoller {
  constructor(container) {
    this.container = container;
    this.initUI();
  }

  initUI() {
    this.container.innerHTML = `
      <h2>Dice Roller</h2>
      <button id="roll-d4">Roll d4</button>
      <button id="roll-d6">Roll d6</button>
      <button id="roll-d8">Roll d8</button>
      <button id="roll-d10">Roll d10</button>
      <button id="roll-d12">Roll d12</button>
      <button id="roll-d20">Roll d20</button>
      <div id="dice-result"></div>
    `;

    this.initEventListeners();
  }

  initEventListeners() {
    this.container.querySelector('#roll-d4').addEventListener('click', () => this.rollDice(4));
    this.container.querySelector('#roll-d6').addEventListener('click', () => this.rollDice(6));
    this.container.querySelector('#roll-d8').addEventListener('click', () => this.rollDice(8));
    this.container.querySelector('#roll-d10').addEventListener('click', () => this.rollDice(10));
    this.container.querySelector('#roll-d12').addEventListener('click', () => this.rollDice(12));
    this.container.querySelector('#roll-d20').addEventListener('click', () => this.rollDice(20));
  }

  rollDice(sides) {
    const result = rollDice(sides);
    this.container.querySelector('#dice-result').innerText = `Result: ${result}`;
  }
}
