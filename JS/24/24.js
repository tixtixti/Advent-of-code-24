const fs = require('node:fs').promises

async function main() {
    const input = (await fs.readFile('./input.txt', 'utf8')).split('\n')
    let { gates, startsObj } = handleInput(input)

    while (gates.length > 0) {
        gates.forEach((node) => {
            const { xGate, operator, yGate, output } = node
            if (
                startsObj.get(xGate) !== undefined &&
                startsObj.get(yGate) !== undefined
            ) {
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
        gates = gates.filter((node) => node.calculated === false)
        // console.log(gates.length)
    }

    const Zkeys = Array.from(startsObj.keys()).filter((key) => key[0] === 'z')
    const resultArray = Array(Zkeys.length)
    Zkeys.forEach((zkey) => {
        const value = startsObj.get(zkey)
        const [_, index] = zkey.split('z')
        resultArray[Number(index)] = value
    })
    resultArray.reverse()
    console.log(parseInt(resultArray.join(''), 2))
}
main()

const andGate = (x, y) => x == 1 && y == 1
const orGate = (x, y) => x == 1 || y == 1
const xorGate = (x, y) => x != y

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
