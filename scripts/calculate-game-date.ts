import { gameData } from '../src/gameData';

// Get game data count
const gameCount = gameData.length;
console.log(`Game data contains ${gameCount} entries`);

// Calculate the date that many days from day 20265
const startDay = 20265;
const targetDay = startDay + gameCount;

// Convert back to a date
const msPerDay = 1000 * 60 * 60 * 24;
const targetDate = new Date(targetDay * msPerDay);

console.log(`Cluedle will run out of entries on:`);
console.log(targetDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
}));