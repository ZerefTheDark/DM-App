// src/utils/Dice.js

export function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollMultipleDice(numDice = 1, sides = 6) {
  const results = [];
  for (let i = 0; i < numDice; i++) {
    results.push(rollDice(sides));
  }
  return results;
}
