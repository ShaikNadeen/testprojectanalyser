import { greet } from './greeting.js';
import { add, subtract } from './math.js';
import { capitalize } from './stringUtils.js';
import { getCurrentDate } from './dateUtils.js';
import { getRandomColor } from './colorUtils.js';

console.log(greet('World'));
console.log(`2 + 3 = ${add(2, 3)}`);
console.log(`5 - 2 = ${subtract(5, 2)}`);
console.log(`Capitalized: ${capitalize('hello')}`);
console.log(`Current date: ${getCurrentDate()}`);
console.log(`Random color: ${getRandomColor()}`);
