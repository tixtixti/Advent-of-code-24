const fs = require('node:fs').promises

const FILENAME = 'test.txt'
//const FILENAME = 'input.txt'
//const FILENAME = 'smallInput.txt'

// change calculation to results
// start caching results
// ez ?

async function main() {
    const input = await fs.readFile(FILENAME, 'utf8')
    const lines = input.split('\n')
    const towels = lines
        .splice(0, 2)[0]
        .split(',')
        .flat()
        .map((node) => node.trim())
    let towelSet = new Set()
    towels.forEach((node) => towelSet.add(node))

    const result = lines.reduce((prev, curr) => {
        const possibleCombinations = handleSingeLine(curr, towelSet)
        return prev + possibleCombinations
    }, 0)

    console.log({ result })
    return result
}

const handleSingeLine = (line, towelSet) => {
    const lineASChars = line.split('')
    const stackItem = {
        foundTowels: [],
        remainingString: [...lineASChars],
        combinationsFound: 0,
    }
    const stack = [stackItem]
    let foundTowelSystems = []
    let totalCombinations = 0
    while (stack.length > 0) {
        let { foundTowels, remainingString, combinationsFound } = stack.shift()
        if (foundTowels.join('') == line) {
            console.log({ foundTowels, combinationsFound })
            // console.log('Found', foundTowels.join(','))
            totalCombinations++
            foundTowelSystems.push(foundTowels)
            continue
        }

        let stringHelper = ''
        for (let index = 0; index < remainingString.length; index++) {
            const element = remainingString[index]
            stringHelper = stringHelper.concat(element)
            console.log(remainingString, element, stringHelper)
            if (towelSet.has(stringHelper)) {
                // check if string helper
                const currentCombination = [...foundTowels, stringHelper]

                stack.unshift({
                    foundTowels: currentCombination,
                    remainingString: [...remainingString].splice(
                        index + 1,
                        remainingString.length
                    ),
                    combinationsFound: combinationsFound + 1,
                })
            }
        }
    }
    return totalCombinations
}

main()
