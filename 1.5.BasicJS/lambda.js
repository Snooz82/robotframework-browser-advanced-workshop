const add = (a, b) => a + b  //must be defined before usage
console.log("add(1, 2)", add(1, 2))


const double = a => a + a // if one-liner, no return needed and no {}-braces
console.log("double(2)", double(2))


const numberZeroToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const odds = numberZeroToTen.filter(num => num % 2)   // super useful for callbacks
console.log("odds", odds)