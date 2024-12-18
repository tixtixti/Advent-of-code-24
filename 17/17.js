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
/*
main(281474976710655) // ylin
main(35184372088832) // alin
*/
//main((((((((((2 << 3) << 3) << 3) << 3) << 3) << 3) << 3) << 3) << 3) << 3)

// oikeasti alin 106184372088832
// 106_000000000000
// 137000000000000 // 136900000000000 // 109020000000000 // 109014900000000
// 281_474_976_710_655 109014860000000 jemma
// 110500000000000  110274976710655
110500000000000
110274976710655
110474976710655
106184372088832
109020013203201
let smallest2 = 281_4749_7671_0655
let smallest = 181_4749_7671_0655

// 681_4749_7671_0655
let expectedOutput = [2, 4, 1, 5, 7, 5, 0, 3, 4, 1, 1, 6, 5, 5, 3, 0]

//d = [2, 4, 1, 5, 7, 5, 0, 3, 4, 1, 1, 6, 5, 5, 3, 0]
let outerIndex = 1
let exampleOutPut = null
/*
while (outerIndex < 16) {
    let index = 0
    while (index < 10) {
        let smallArray = smallest.toString().split('')
        let expectedIndex = expectedOutput.length - 1 - outerIndex
        let expectedNumberAtindex = expectedOutput[expectedIndex]

        //console.log(luku)
        smallArray[outerIndex] = index
        let inputX = Number(smallArray.join(''))
        //console.log(inputX)
        let outputX = main(inputX)
        let splitted = outputX.split(',')
        if (splitted[expectedIndex] == expectedNumberAtindex) {
            console.log('ping')
            /*
            console.log(
                inputX % 8,
                index,
                inputX,
                splitted.join(','),
                splitted.length
            )
  
            if (inputX < smallest) {
                smallest = inputX
                // exampleOutPut = splitted.join(',')
            }
        }

        tulostus = []
        index = index + 1
        registerMap.clear()
        output = []
        pointer = 0
        skipIncrease = false
    }
    console.log({ smallest, outerIndex, exampleOutPut })
    outerIndex++
}
*/ // oikean 109_0200_1320_3201
//           109_1574_6467_4110
//  smallestValue: 181_4749_7671_0655,
// isoin 281_4749_7671_0655
// 10920013203201
let stackItem = {
    outerIndex: 1,
    innerIndex: 0,
    smallestValue: 109_0200_1320_3201,
}
/*
let longestCurrentSequence = []
let inputForLongest = ''
//109020013203201
const stack = [stackItem]

while (stack.length > 0) {
    // console.log({ sl: stack.length })
    const currentItem = stack.pop()
    let stackOuterIndex = currentItem.outerIndex
    let stackInnerIndex = currentItem.innerIndex
    let stackSmallestValue = currentItem.smallestValue
    while (stackOuterIndex < 16) {
        //console.log(stackOuterIndex)
        stackInnerIndex = 0
        while (stackInnerIndex < 10) {
            //console.log(stackInnerIndex)
            let smallArray = stackSmallestValue.toString().split('')

            let expectedSequence = [...expectedOutput].splice(
                expectedOutput.length - stackOuterIndex,
                stackOuterIndex
            )
            smallArray[stackOuterIndex] = stackInnerIndex
            let inputX = Number(smallArray.join(''))

            //console.log(inputX)
            let outputX = main(inputX)
            // console.log(inputX, outputX)
            let splitted = outputX.split(',')
            let expectedSplitted = [...splitted].splice(
                expectedOutput.length - stackOuterIndex,
                stackOuterIndex
            )
            //console.log(expectedSequence, expectedSplitted)

            //console.log(expectedSequence, expectedSplitted, stackOuterIndex)
            if (expectedSequence.toString() == expectedSplitted.toString()) {
                //console.log(splitted.join(''), expectedSequence, inputX)
                if (longestCurrentSequence.length < expectedSplitted.length) {
                    longestCurrentSequence = expectedSplitted
                    inputForLongest = inputX
                }

                if (inputX < smallest) {
                    stackSmallestValue = inputX
                    // exampleOutPut = splitted.join(',')
                    stack.push({
                        outerIndex: stackOuterIndex + 1,
                        innerIndex: stackInnerIndex + 1,
                        smallestValue: inputX,
                    })
                } else {
                    stack.push({
                        outerIndex: stackOuterIndex + 1,
                        innerIndex: stackInnerIndex + 1,
                        smallestValue: stackSmallestValue,
                    })
                }
            }

            tulostus = []
            stackInnerIndex = stackInnerIndex + 1
            registerMap.clear()
            output = []
            pointer = 0
            skipIncrease = false
        }
        stackOuterIndex = stackOuterIndex + 1
    }
}
console.log(longestCurrentSequence, inputForLongest, inputForLongest % 8)

// console.log(stack)
//109_0200_1320_3201
//281474976710654
//140737488355326
// 109951162777598
// 106102872080382
*/
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
xxx.reverse()

let oldResult = 24
let resultArray = []
for (let index = 1; index < xxx.length; index++) {
    const element = xxx[index]

    i = 0
    if (index === 0) {
    } else {
        while (i < 8) {
            let aaa = Number(i.toString().concat((oldResult * 8).toString()))
            //console.log({ input: aaa, i })
            let result = main(aaa)
            let cc = result.split(',').reverse()[index]
            if (cc == element) {
                console.log(result, index, cc)
                oldResult = aaa
                resultArray.push[cc]
                break
            }

            //console.log(allCommand.length, ba % 8)
            reset()
            i++
        }
    }
    console.log(resultArray)
}

//                                   12 13 14 15 16
// [2, 4, 1, 5, 7, 5, 0, 3, 4, 1, 1, 6, 5, 5, 3, 0]
// 109_0200_1320_3201
// 128 komentoo 8* 16, 16 outtia, 8^15 - 8^16 väli
module.exports = main
/*
            console.log(
                inputX % 8,
                index,
                inputX,
                splitted.join(','),
                splitted.length
            )
                
console.log(main(35_1843_7208_8832))
console.log(allCommand.length, 35_1843_7208_8832 % 8)
console.log(main(281474976710654 - 35184372088832))
console.log(allCommand.length, (281474976710654 - 35184372088832) % 8)
109_0200_1320_3201
                */
