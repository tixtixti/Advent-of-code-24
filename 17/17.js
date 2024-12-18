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
//
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
    const newBValue = Math.abs(comboValue % 8)
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
    const newBValue = (bValue ^ cValue) >>> 0
    registerMap.set(B, newBValue)
}
const bxl = (operand) => {
    const bValue = registerMap.get(B)
    const newBValue = (bValue ^ operand) >>> 0
    registerMap.set(B, newBValue)
}
const out = (operand) => {
    const value = Math.abs(getComboOperandValue(operand) % 8)
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

const reset = () => {
    tulostus = []
    //stackInnerIndex = stackInnerIndex + 1
    registerMap.clear()
    output = []
    pointer = 0
    skipIncrease = false
}
// 192 /3
let i = 0
let xxx = [2, 4, 1, 5, 7, 5, 0, 3, 4, 1, 1, 6, 5, 5, 3, 0]
let xxx2 = [2, 4, 1, 5, 7, 5, 0, 3, 4, 1, 1, 6, 5, 5, 3, 0]
//let xxx = [0, 3, 5, 4, 3, 0]
//let xxx2 = [0, 3, 5, 4, 3, 0]
xxx.reverse()

let candidates = [0]
for (let index = 0; index < 16; index++) {
    const opToLook = xxx[index]
    const newCandidates = []

    while (candidates.length > 0) {
        const currentItem = candidates.pop()
        for (let i = 0; i < 8; i++) {
            let candidate = Number(currentItem + i)
            let result = main(candidate)
            const currentOp = result[0]
            //console.log(result)
            if (result == xxx2.join(',')) {
                console.log('löysit jotain', result, candidate)
            } else if (currentOp == opToLook) {
                newCandidates.push(candidate * 8)
            }
            reset()
        }
    }
    candidates = newCandidates
}

let stackItem = {
    innerIndex: 0,
    currentValue: 199_9999_9999_9999,
}

let expectedOutput = [2, 4, 1, 5, 7, 5, 0, 3, 4, 1, 1, 6, 5, 5, 3, 0]

let outerIndex = 1
let stack = [stackItem]
let allSolutions = []
while (outerIndex < 16) {
    let newStack = []
    while (stack.length > 0) {
        const currentItem = stack.pop()

        let currentValue = currentItem.currentValue

        stackInnerIndex = 0
        while (stackInnerIndex < 10) {
            //console.log(stackInnerIndex)
            let smallArray = currentValue.toString().split('')

            let expectedSequence = [...expectedOutput].splice(
                expectedOutput.length - outerIndex,
                outerIndex
            )
            smallArray[outerIndex] = stackInnerIndex
            let inputX = Number(smallArray.join(''))

            let outputX = main(inputX)

            let splitted = outputX.split(',')
            let expectedSplitted = [...splitted].splice(
                expectedOutput.length - outerIndex,
                outerIndex
            )

            if (expectedSequence.toString() == expectedSplitted.toString()) {
                if (expectedOutput.toString() === splitted.toString()) {
                    allSolutions.push(inputX)
                }
                //console.log(inputX, outputX)
                newStack.push({
                    currentValue: inputX,
                })
            }

            stackInnerIndex = stackInnerIndex + 1
            reset()
        }
    }
    stack = [...newStack]
    outerIndex++
}

console.log(allSolutions.sort().find((node) => node === 1090200257_20585))
//console.log(main(Number(longestIs.join(''))))
reset()
console.log(main(1090200132_01563))
module.exports = main
