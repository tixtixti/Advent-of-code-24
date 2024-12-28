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
        '>': ['v', '>', 'A'],
        '^': ['A'],
    },
    A: {
        '^': ['<', 'A'],
        v: ['<', 'v', 'A'],
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

const routes = ['029A', '980A', '179A', '456A', '379A'] // test //126384
//const routes = ['540A', '839A', '682A', '826A', '974A'] //real //278568
//const routes = ['286A', '974A', '189A', '802A', '805A'] // mika

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

const calculateStepsWithStack = (startCoord, curr, remainingRounds) => {
    const key = `${startCoord}_${curr}_${remainingRounds}`
    // Check if the result is cached
    if (memoizationMap.has(key)) {
        return memoizationMap.get(key)
    }

    // Initialize stack and variables
    const stack = [{ startCoord, curr, remainingRounds }]
    let totalPaths = 0

    // Stack-based iterative processing
    while (stack.length > 0) {
        const { startCoord, curr, remainingRounds } = stack.pop()
        const loopKey = `${startCoord}_${curr}_${remainingRounds}`
        if (memoizationMap.has(loopKey)) {
            totalPaths += memoizationMap.get(loopKey)
            continue
        }
        // Base case: no more rounds
        if (remainingRounds - 1 === 0) {
            const baseResult = abba[startCoord][curr].length
            memoizationMap.set(loopKey, baseResult)
            totalPaths += baseResult
            continue
        }

        // Add next possible steps to the stack
        const directions = abba[startCoord][curr]
        directions.forEach((nextDir, index, self) => {
            let startCoord = index === 0 ? A : self[index - 1]

            stack.push({
                startCoord,
                curr: nextDir,
                remainingRounds: remainingRounds - 1,
            })
        })
    }

    // Cache the result
    memoizationMap.set(key, totalPaths)
    return totalPaths
}

const memoizationMap = new Map() // Cache for results

let allCombs = []
Object.keys(abba).forEach((start) => {
    Object.keys(abba[start]).forEach((end) => {
        allCombs.push([start, end])
    })
})
allCombs.sort((a) => (a[0] === A ? -1 : 1))

let i = 1
while (i < 26) {
    allCombs.forEach((comb) => {
        calculateStepsWithStack(comb[0], comb[1], i)
    })
    i++
}

//console.log(memoizationMap)

// shorter is not always better :D
const main2 = (rounds) =>
    routes.reduce(
        (prev, route) =>
            prev +
            handleStep(route, numPad)
                .map((routeAsString) =>
                    routeAsString
                        .split('')
                        .reduce(
                            (prev, char, index, self) =>
                                prev +
                                calculateStepsWithStack(
                                    index === 0 ? A : self[index - 1],
                                    char,
                                    rounds
                                ),
                            0
                        )
                )
                .reduce((prev, node) => Math.min(prev, node), Infinity) *
                Number(route.split('').splice(0, 3).join('')),
        0
    )

console.log({ target: 154115708116294, result: main2(25) })
