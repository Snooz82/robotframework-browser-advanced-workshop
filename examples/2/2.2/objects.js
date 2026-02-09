const myObject = { key: "test", key2: [ 1, 2, 3 ], key3: null, key4: { subKey: "test" } };
const jsonString = JSON.stringify(myObject);
console.log(jsonString);
const myParsedObject = JSON.parse(jsonString);
console.log(`key is ${myParsedObject.key}`)