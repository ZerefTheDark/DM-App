export default class CharacterSheet {
  constructor(container) {
    this.container = container;
    this.initUI();
  }

  initUI() {
    this.container.innerHTML = `
      <h2>Character Sheet</h2>
      <div id="character-tabs">
        <button class="tab-button active" data-tab="stats">Stats</button>
        <button class="tab-button" data-tab="inventory">Inventory</button>
        <button class="tab-button" data-tab="actions">Actions</button>
        <button class="tab-button" data-tab="spells">Spells</button>
      </div>
      <div id="character-content">
        <div class="tab-content active" id="stats-content">
          <!-- Stats content goes here -->
        </div>
        <div class="tab-content" id="inventory-content">
          <!-- Inventory content goes here -->
        </div>
        <div class="tab-content" id="actions-content">
          <!-- Actions content goes here -->
        </div>
        <div class="tab-content" id="spells-content">
          <!-- Spells content goes here -->
        </div>
      </div>
    `;

    this.initTabSwitching();
  }

  initTabSwitching() {
    const tabButtons = this.container.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        this.showTab(tab);
      });
    });
  }

  showTab(tab) {
    const tabButtons = this.container.querySelectorAll('.tab-button');
    const tabContents = this.container.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.classList.remove('active');
    });

    tabContents.forEach(content => {
      content.classList.remove('active');
    });

    this.container.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add('active');
    this.container.querySelector(`#${tab}-content`).classList.add('active');
  }
}
