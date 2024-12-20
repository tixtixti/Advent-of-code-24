const fs = require('node:fs').promises

const FILENAME = 'test.txt'
//const FILENAME = 'input.txt'
//const FILENAME = 'smallInput.txt'

async function main() {
    const input = await fs.readFile(FILENAME, 'utf8')
    const lines = input.split('\n')
    const towels = lines
        .splice(0, 2)[0]
        .split(',')
        .flat()
        .map((node) => node.trim())
    let towelSet = new Set()
    let towelScores = new Map()
    let calculatedScore = new Map()
    towels.forEach((node) => towelSet.add(node))

    towels.sort((a, b) => a.length - b.length)
    towels.forEach((node) => towelScores.set(node, 1))
    /*
    const result = lines.reduce((prev, curr) => {
        const possibleCombinations = handleSingeLineForInput(
            curr,
            towelSet,
            towelScores,
            calculatedScore
        )
        return prev + possibleCombinations
    }, 0)
    */
    const result = lines.reduce((prev, curr) => {
        const possibleCombinations = fiftyFifty(curr, towelSet)
        return prev + possibleCombinations
    }, 0)

    // const result = 0
    console.log({ result })
    return result
}

const handleSingeLine = (line, towelSet) => {
    const lineASChars = line.split('')
    const stackItem = {
        foundTowels: [],
        remainingString: [...lineASChars],
    }
    const stack = [stackItem]
    let foundTowelSystems = []

    while (stack.length > 0) {
        let { foundTowels, remainingString } = stack.pop()
        if (foundTowels.join('') == line) {
            foundTowelSystems.push(foundTowels)

            continue
        }

        let stringHelper = ''
        for (let index = 0; index < remainingString.length; index++) {
            const element = remainingString[index]
            stringHelper = stringHelper.concat(element)
            if (towelSet.has(stringHelper)) {
                // check if string helper
                const currentCombination = [...foundTowels, stringHelper]

                stack.push({
                    foundTowels: currentCombination,
                    remainingString: [...remainingString].splice(
                        index + 1,
                        remainingString.length
                    ),
                })
            }
        }
    }
    return foundTowelSystems
}

const calculateSubStringScores = (subString, towels, calculatedScore) => {
    const res = handleSingeLine(subString, towels)
    if (res.length > 0) {
        calculatedScore.set(subString, res.length)
        return res.length
    } else {
        return false
    }
}

const handleSingeLineForInput = (
    line,
    towelSet,
    towelScores,
    calculatedScore
) => {
    const lineASChars = line.split('')
    const stackItem = {
        foundTowels: [],
        remainingString: [...lineASChars],
        score: 0,
    }
    const stack = [stackItem]

    let counter = 0
    while (stack.length > 0) {
        let { foundTowels, remainingString, score } = stack.pop()
        if (foundTowels.join('') == line) {
            counter++
            continue
        }

        let stringHelper = ''
        for (let index = 0; index < remainingString.length; index++) {
            const element = remainingString[index]

            const reversed = [...remainingString]
                .reverse()
                .splice(0, remainingString.length - index)
            let reversedScore = 0
            if (reversed.length < remainingString.length / 2) {
                if (!towelSet.has(reversed.join(''))) {
                    if (calculatedScore.get(reversed.join(''))) {
                        reversedScore = calculatedScore.get(reversed.join(''))
                    } else {
                        const shr = handleSingeLine(reversed.join(''), towelSet)
                        reversedScore = shr.length
                        calculatedScore.set(reversed.join(''), reversedScore)
                    }
                    console.log(calculatedScore)
                } else {
                    reversedScore = towelScores.get(reversed.join(''))
                }
            }
            stringHelper = stringHelper.concat(element)
            if (towelSet.has(stringHelper) || reversedScore > 0) {
                const currentCombination =
                    reversedScore > 0
                        ? [...foundTowels, stringHelper, reversed]
                        : [...foundTowels, stringHelper]

                if (reversedScore > 0) {
                    // console.log(reversed.join(''))
                }
                // console.log(currentCombination.join(''))
                // check if string helper

                stack.push({
                    foundTowels: currentCombination,
                    score:
                        score + towelScores.get(stringHelper) + reversedScore,
                    remainingString: [...remainingString].splice(
                        index + 1,
                        remainingString.length
                    ),
                })
            }
        }
    }
    return counter
}

const fiftyFifty = (line, towelSet) => {
    const lineASChars = line.split('')
    console.log(line)

    const what = lineASChars.splice(0, lineASChars.length / 2)
    console.log(lineASChars, what[1].join(''))
    console.log(what[0].join(''), what[1])
    const aa = handleSingeLine(what[0].join(''), towelSet)
    const bb = handleSingeLine(what[1].join(''), towelSet)
    console.log(aa, bb)
    return 1
}
main()
