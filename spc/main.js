import './styles.css';
import BattleMap from './components/BattleMap.js';
import CharacterSheet from './components/CharacterSheet.js';
import DiceRoller from './components/DiceRoller.js';
import InitiativeTracker from './components/InitiativeTracker.js';
import ChatWindow from './components/ChatWindow.js';

document.addEventListener('DOMContentLoaded', () => {
  new BattleMap(document.getElementById('battle-map'));
  new CharacterSheet(document.getElementById('character-sheet'));
  new DiceRoller(document.getElementById('dice-roller'));
  new InitiativeTracker(document.getElementById('initiative-tracker'));
  new ChatWindow(document.getElementById('chat-window'));
});