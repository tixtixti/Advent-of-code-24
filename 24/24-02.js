const fs = require('node:fs').promises

async function main() {
    const input = (await fs.readFile('./input.txt', 'utf8')).split('\n')
    let { gates, startsObj } = handleInput(input)
    inputValuesForStartsObj(startsObj, 'x', 1)
    inputValuesForStartsObj(startsObj, 'y', 1)

    let i = 0
    let carryCode = null
    while (i < 43) {
        let searchX = i < 10 ? `x0${i}` : `x${i}`
        let searchY = i < 10 ? `y0${i}` : `y${i}`
        let searchZ = i < 10 ? `z0${i}` : `z${i}`

        console.log({ searchX, searchY, searchZ })
        if (i === 0) {
            // let initialXor = findGate(gates, searchX, searchY, 'XOR')
            let initialAnd = findGateOutput(gates, searchX, searchY, 'AND')
            carryCode = initialAnd
        } else {
            let intermediateXor = findGateOutput(gates, searchX, searchY, 'XOR')

            let carryInXor = findGateOutput(
                gates,
                carryCode,
                intermediateXor,
                'XOR'
            )
            if (carryInXor !== searchZ) {
                throw new Error(
                    `INCORRECT OUTPUT ${carryInXor} shouldBe: ${searchZ}`
                )
            }
            let stepCarryGeneration = findGateOutput(
                gates,
                searchX,
                searchY,
                'AND'
            )
            let stepCarryPropagation = findGateOutput(
                gates,
                carryCode,
                intermediateXor,
                'AND'
            )
            let carryOut = findGateOutput(
                gates,
                stepCarryGeneration,
                stepCarryPropagation,
                'OR'
            )
            carryCode = carryOut
        }
        i++
    }
}
// main()
// qjb gvw z15 jgc drg z22 jbp z35
// x08 XOR y08 -> gvw
// x08 AND y08 -> qjb
// y15 AND x15 -> jgc
// fbv XOR rgt -> z15
// hwm AND tdc -> drg
// tdc XOR hwm -> z22
const sortLastOnes = [
    'qjb',
    'gvw',
    'z15',
    'jgc',
    'drg',
    'z22',
    'jbp',
    'z35',
].sort()
console.log(sortLastOnes.toString())
const findGateOutput = (gates, xGate, yGate, operator) => {
    let searchCodes = [xGate, yGate]
    let gateFound = gates.find((gate) => {
        return (
            searchCodes.includes(gate.xGate) &&
            searchCodes.includes(gate.yGate) &&
            gate.operator == operator
        )
    })
    if (!gateFound) {
        let effected = gates.filter((gate) => {
            return (
                searchCodes.includes(gate.xGate) ||
                searchCodes.includes(gate.yGate) ||
                searchCodes.includes(gate.output)
            )
        })
        console.log({ effected })
        throw new Error(
            `NOT FOUND x: ${xGate} y: ${yGate},operator: ${operator}`
        )
    }
    return gateFound.output
}
const handleRound = (gates, startsObj) => {
    let roundMap = new Map(startsObj)
    let copyOfOriginalGates = JSON.parse(JSON.stringify(gates))
    while (copyOfOriginalGates.length > 0) {
        let notVisited = true
        copyOfOriginalGates.forEach((node) => {
            const { xGate, operator, yGate, output } = node
            if (
                roundMap.get(xGate) !== undefined &&
                roundMap.get(yGate) !== undefined
            ) {
                notVisited = false
                const xGateValue = roundMap.get(xGate)
                const yGateValue = roundMap.get(yGate)
                const operationResult = handleOperation(
                    xGateValue,
                    yGateValue,
                    operator
                )
                node.calculated = true
                roundMap.set(output, operationResult)
            }
        })
        if (notVisited) {
            return null
        }
        copyOfOriginalGates = copyOfOriginalGates.filter(
            (node) => node.calculated === false
        )

        // console.log(gates.length)
    }
    const res = findBinaryForSymbol(roundMap, 'z')
    return res
}

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

const findBinaryForSymbol = (startsObj, symbol) => {
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
    return resultArray.join('')
}
const inputValuesForStartsObj = (startsObj, symbolToChange, valueToInput) => {
    Array.from(startsObj.keys()).map((key) => {
        if (key[0] === symbolToChange) {
            startsObj.set(key, valueToInput)
        }
    })
}
