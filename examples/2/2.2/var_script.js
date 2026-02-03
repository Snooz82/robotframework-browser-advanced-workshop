const fixedValue = "Hello World";

let localButGlobal

if (fixedValue.includes("World")) {
    localButGlobal = fixedValue.replace("World", "RoboCon")
    const constantNewValue = fixedValue.replace("World", "RoboCon")
    var newValue = fixedValue.replace("World", "RoboCon")
    let localValue = fixedValue.replace("World", "RoboCon")
    console.log("localButGlobal: ", localButGlobal)
    console.log("constantNewValue: ", constantNewValue)
    console.log("newValue: ", newValue)
    console.log("localValue: ", localValue)
    localValue = localValue.replace("Hello", "Hi")
    console.log("localValue2: ", localValue)


    newValue = newValue.replace("Hello", "Hi")
    localButGlobal = localButGlobal.replace("Hello", "Hi")
}

console.log("localButGlobal2: ", localButGlobal)
console.log("newValue2: ", newValue)

