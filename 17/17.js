const fs = require('node:fs').promises

const A = 'A'
const B = 'B'
const C = 'C'
const registerMap = new Map()
let output = []
let pointer = 0
let skipIncrease = false

async function main(filename) {
    const map = (await fs.readFile(filename, 'utf8')).split('\n')
    let [aRegister, bRegister, cRegister] = map
        .splice(0, 3)
        .map((node) => Number(node.split(': ')[1]))
        .flat()
    const programValues = map
        .splice(1, 2)[0]
        .split(': ')
        .splice(1, 2)[0]
        .split(',')
        .map(Number)

    console.log(programValues)
    //console.log({ aRegister, bRegister, cRegister })

    registerMap.set(A, aRegister)
    registerMap.set(B, bRegister)
    registerMap.set(C, cRegister)
    console.log(registerMap)
    // do software

    // pointer, aina parit, combot pitää lukea jostain muualta. getComboOperandValue

    while (pointer < programValues.length) {
        const opCode = programValues[pointer]
        const operand = programValues[pointer + 1]

        chooseProgram(opCode, operand)

        if (skipIncrease) {
            skipIncrease = false
        } else {
            pointer = pointer + 2
        }
    }

    console.log(output.toString())
    return output.toString()
}

const targetdv = (operand, targetRegister) => {
    const powerTo = getComboOperandValue(operand)
    const aValue = registerMap.get(A)
    const newValue = Math.trunc(aValue / Math.pow(2, powerTo))
    registerMap.set(targetRegister, newValue)
}
const bst = (operand) => {
    const comboValue = getComboOperandValue(operand)
    const newBValue = comboValue % 8
    registerMap.set(B, newBValue)
}
const jzn = (operand) => {
    // only jump if opCode === 3
    const aValue = registerMap.get(A)
    if (aValue === 0) {
        // do nothing
    } else {
        pointer = operand
        skipIncrease = true
    }
}
const bxc = (_operand) => {
    const bValue = registerMap.get(B)
    const cValue = registerMap.get(C)
    const newBValue = bValue ^ cValue
    registerMap.set(B, newBValue)
}
const bxl = (operand) => {
    const bValue = registerMap.get(B)
    const newBValue = bValue ^ operand
    registerMap.set(B, newBValue)
}
const out = (operand) => {
    const value = getComboOperandValue(operand) % 8
    output.push(value)
}

const chooseProgram = (opCode, operand) => {
    switch (opCode) {
        case 0:
            targetdv(operand, A)
            break
        case 1:
            bxl(operand)
            break
        case 2:
            bst(operand)
            break
        case 3:
            jzn(operand)
            break
        case 4:
            bxc(operand)
            break
        case 5:
            out(operand)
            break
        case 6:
            targetdv(operand, B)
            break
        case 7:
            targetdv(operand, C)
            break

        default:
            break
    }
}

const getComboOperandValue = (operand) => {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand
        case 4:
            return registerMap.get(A)
        case 5:
            return registerMap.get(B)
        case 6:
            return registerMap.get(C)
        case 7:
            throw new Error('You fucked up')
    }
}
module.exports = main
