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

const routes = ['029A', '980A', '179A', '456A', '379A'] // test //126384
//const routes = ['540A', '839A', '682A', '826A', '974A'] //real //278568
//const routes = ['029A']
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
    return route.split('').reduce((prev, curr, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]
        return prev + abba[startCoord][curr].join('')
    }, '')
}
const secondaryStepsCache = (route, round) => {
    //console.log(route)

    return route.split('').reduce((prev, curr, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]
        //console.log(curr)
        // check if this start_curr_round exists, if not. fully calculate that pair thing out all the rounds  and then proceed for next characters
        return prev + calculateStepsWithStack(startCoord, curr, round)
    }, 0)
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

        // Base case: no more rounds
        if (remainingRounds - 1 === 0) {
            totalPaths += abba[startCoord][curr].length
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

const res = routes.reduce((prev, route) => {
    const allRoutesAsString = handleStep(route, numPad)

    let tempSteps = allRoutesAsString
    let i = 0
    /*
    while (i < 2) {
        tempSteps = tempSteps.map((node) => {
            return secondarySteps(node, 2)
        })

        i++
    }
    const finalScore = tempSteps.reduce(
        (prev, node) => Math.min(prev, node.length),
        Infinity
    )
*/
    const temp = allRoutesAsString.map((route) => secondaryStepsCache(route, 2))
    const finalScore = temp.reduce(
        (prev, node) => Math.min(prev, node),
        Infinity
    )
    console.log({ finalScore })
    const other = Number(route.split('').splice(0, 3).join(''))
    return prev + finalScore * other
}, 0)
console.log(res)

//console.log(secondaryStepsCache('<A<^A', 16))
// console.log(secondaryStepsCache('<A^A>^^AvvvA', 2))
