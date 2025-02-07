console.log('"32" == 32', "32" == 32)
console.log('"32" === 32', "32" === 32)

const k1 = { fruit: '🥝' };
const k2 = { fruit: '🥝' };
const k3 = k1

console.log('k1 === k2', k1 === k2); // false / similar to python `k1 is k2`
console.log('k1 === k3', k1 === k3); // true / similar to python `k1 is k3`

console.log('JSON.stringify(k1)', JSON.stringify(k1))
console.log('JSON.stringify(k1) === JSON.stringify(k2)', JSON.stringify(k1) === JSON.stringify(k2)); // true 

k3.fruit = '🍌'

console.log('k1', k1)