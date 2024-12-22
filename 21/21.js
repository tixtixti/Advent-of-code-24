const AStar = require('./AStar.js')
const GraphLibrary = require('./GraphLibrary.js')
const { bfsFindAllRoutes } = require('./BFS.js')

const A = 'A'
const numPad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', A],
]
const keyPad = [
    [null, '^', 'A'],
    ['<', 'v', '>'],
]
const abba = {
    '>': {
        '^': ['<', '^', 'A'],
        A: ['^', 'A'],
        v: ['<', 'A'],
        '<': ['<', '<', 'A'],
        '>': ['A'],
    },
    v: {
        '^': ['^', 'A'],
        A: ['^', '>', 'A'],
        '<': ['<', 'A'],
        '>': ['>', 'A'],
        v: ['A'],
    },
    '^': {
        A: ['>', 'A'],
        v: ['v', 'A'],
        '<': ['v', '<', 'A'],
        '>': ['>', 'v', 'A'],
        '^': ['A'],
    },
    A: {
        '^': ['<', 'A'],
        v: ['v', '<', 'A'],
        '<': ['v', '<', '<', 'A'],
        '>': ['v', 'A'],
        A: ['A'],
    },
    '<': {
        '^': ['>', '^', 'A'],
        A: ['>', '>', '^', 'A'],
        v: ['>', 'A'],
        '>': ['>', '>', 'A'],
        '<': ['A'],
    },
}

function generateCombinations(lines) {
    const results = []

    function helper(currentCombination, index) {
        if (index === lines.length) {
            // We've chosen one item per line; add to results
            results.push(currentCombination)
            return
        }

        // Iterate over each item in the current line
        for (const item of lines[index]) {
            helper([...currentCombination, item], index + 1)
        }
    }

    helper([], 0)
    return results
}

//const routes = ['029A', '980A', '179A', '456A', '379A'] // test
//const routes = ['540A', '839A', '682A', '826A', '974A'] //real
const routes = ['029A']
//const routes = ['456A']

// eka setti breah first ja sitten vaan käyt kaikki läpi?`

const handleStep = (route, graph) => {
    const allRoutesPerStep = []
    route.split('').forEach((curr, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]

        const start = GraphLibrary.findStartingPoint(graph, startCoord).flat()
        const end = GraphLibrary.findStartingPoint(graph, curr).flat()

        const allRoutes = bfsFindAllRoutes(numPad, start, end)
        let mid = allRoutes.map((node) => [...node, A])
        allRoutesPerStep.push(mid)
    })
    return generateCombinations(allRoutesPerStep).map((node) =>
        node.flat().join('')
    )
}

const secondarySteps = (route) => {
    //console.log(route)
    return route.split('').reduce((prev, curr, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]
        return prev + abba[startCoord][curr].join('')
    }, '')
}

const calculateSingleInputTimes = (char, prev, temp, i, precomputedResults) => {
    if (i === 0) {
        return temp
    }
    const key = `${char}_${i}`
    if (precomputedResults.has(key)) {
        return precomputedResults.get(key) // Return cached result
    }

    let allChanges = abba[prev][char]
    let result = 0
    allChanges.forEach((change) => {
        result += calculateSingleInputTimes(
            change,
            char,
            temp + allChanges.length,
            i - 1,
            precomputedResults
        )
    })
    precomputedResults.set(key, result)
    return result
}
const precomputedResults = new Map()
const res = routes.reduce((prev, route) => {
    const allRoutesAsString = handleStep(route, numPad)

    let tempSteps = allRoutesAsString[2]
    console.log(tempSteps)

    let result = 0
    const stack = []

    // Initialize the stack
    tempSteps.split('').forEach((node) => {
        stack.push({ item: node, remainingBlinks: 2 })
    })

    while (stack.length > 0) {
        const process = stack.shift()

        // Compute result on-demand and cache it
        const computed = calculateSingleInputTimes(
            process.item,
            A,
            result,
            process.remainingBlinks,
            precomputedResults
        )
        result += computed
    }

    /*
    const finalScore = tempSteps.reduce(
        (prev, node) => Math.min(prev, node.length),
        20000
    )
*/
    console.log({ result })
    const other = Number(route.split('').splice(0, 3).join(''))
    return prev + result * other
}, 0)
console.log(res)
