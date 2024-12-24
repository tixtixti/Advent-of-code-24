const fs = require('node:fs').promises

async function main() {
    const input = (await fs.readFile('./input.txt', 'utf8')).split('\n')

    let res = 0
    const expected = 40
    const original = res
    let swapIndex = 1
    while (res !== expected) {
        console.log(swapIndex)
        res = handleRound(JSON.parse(JSON.stringify(input)), swapIndex)
        swapIndex++
    }
}
main()

const andGate = (x, y) => x == 1 && y == 1
const orGate = (x, y) => x == 1 || y == 1
const xorGate = (x, y) => x != y

const findIntergerForSymbol = (startsObj, symbol) => {
    const Zkeys = Array.from(startsObj.keys()).filter(
        (key) => key[0] === symbol
    )
    const resultArray = Array(Zkeys.length)
    Zkeys.forEach((zkey) => {
        const value = startsObj.get(zkey)
        const [_, index] = zkey.split(symbol)
        resultArray[Number(index)] = value
    })
    resultArray.reverse()
    return parseInt(resultArray.join(''), 2)
}
const gateToBit = (x, y, fn) => (fn(x, y) ? 1 : 0)
const handleOperation = (x, y, operation) => {
    switch (operation) {
        case 'AND':
            return gateToBit(x, y, andGate)
        case 'OR':
            return gateToBit(x, y, orGate)
        case 'XOR':
            return gateToBit(x, y, xorGate)
    }
}

const handleInput = (input) => {
    const emptyIndex = input.findIndex((node) => node === '')
    const starts = input.splice(0, emptyIndex) // get starts
    input.shift() // remove emptyline
    const startsObj = new Map()
    const gates = []
    starts.forEach((node) => {
        const [wire, value] = node.split(': ')
        // console.log(wire, value)
        startsObj.set(wire, value)
    })
    input.forEach((node) => {
        const [xGate, operator, yGate, _, output] = node.split(' ')
        gates.push({ xGate, yGate, operator, output, calculated: false })
    })
    return { gates, startsObj }
}

const handleRound = (input, swap) => {
    let { gates, startsObj } = handleInput(input)
    let temp = gates[0].output
    let temp2 = gates[swap].output
    gates[swap].output = temp
    gates[0].output = temp2
    // const inputX = findIntergerForSymbol(startsObj, 'x')
    // const inputY = findIntergerForSymbol(startsObj, 'y')
    //  console.log({ inputX, inputY })
    let operationCompleted = false
    let gatesToCalculate = JSON.parse(JSON.stringify(gates))
    while (gatesToCalculate.length > 0) {
        gatesToCalculate.forEach((node) => {
            const { xGate, operator, yGate, output } = node
            if (
                startsObj.get(xGate) !== undefined &&
                startsObj.get(yGate) !== undefined
            ) {
                operationCompleted = true
                const xGateValue = startsObj.get(xGate)
                const yGateValue = startsObj.get(yGate)
                const operationResult = handleOperation(
                    xGateValue,
                    yGateValue,
                    operator
                )
                node.calculated = true
                startsObj.set(output, operationResult)
            }
        })
        if (!operationCompleted) {
            break
        }
        gatesToCalculate = gatesToCalculate.filter(
            (node) => node.calculated === false
        )
        // console.log(gates.length)
    }
    return findIntergerForSymbol(startsObj, 'z') // with test should be 40
}
