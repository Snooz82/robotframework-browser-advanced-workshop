function add(a, b) {
    console.log(`${a} + ${b} = ${a + b}`);
    return a + b;
}
console.log("add(1, 2)", add(1, 2))

const numberZeroToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const odds = numberZeroToTen.filter(isOdd)
console.log("odds", odds)

function isOdd(num) { return num % 2; }  //can be defined after usage