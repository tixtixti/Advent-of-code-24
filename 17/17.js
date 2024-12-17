const A = 'A'
const B = 'B'
const C = 'C'
const registerMap = new Map()
let output = []
let pointer = 0
let skipIncrease = false

const input = `Register A: 47719761
Register B: 9
Register C: 1

Program: 2,4,1,5,7,5,0,3,4,1,1,6,5,5,3,0
`
function main(newA) {
    const map = input.split('\n')
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

    //console.log(programValues)
    //console.log({ aRegister, bRegister, cRegister })

    registerMap.set(A, newA)
    registerMap.set(B, bRegister)
    registerMap.set(C, cRegister)
    //console.log(registerMap)
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

    // console.log({ tulos: output.toString() })
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
/*
main(281474976710655) // ylin
main(35184372088832) // alin
*/
//main((((((((((2 << 3) << 3) << 3) << 3) << 3) << 3) << 3) << 3) << 3) << 3)

let index = 0
// oikeasti alin 106184372088832
// 106_000000000000
// 137000000000000 // 136900000000000 // 109020000000000 // 109014900000000
// 281_474_976_710_655 109014860000000
// 110500000000000
while (index < 100) {
    let change = Math.pow(10, 4) * index
    const luku = 109014860000000 - change
    //console.log(luku)

    let tulostus = main(luku)
    let splitted = tulostus.split(',')
    if (
        splitted[15] == 0 &&
        splitted[14] == 3 &&
        splitted[13] == 5 &&
        splitted[12] == 5 &&
        splitted[11] == 6
    ) {
        console.log(luku % 8, index, luku, splitted.join(','), splitted.length)
    }
    tulostus = []
    index = index + 1
    registerMap.clear()
    output = []
    pointer = 0
    skipIncrease = false
}

module.exports = main
