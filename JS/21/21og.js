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
        '^': ['<', '^'],
        A: ['^'],
        v: ['<'],
        '<': ['<', '<'],
        '>': [],
    },
    v: {
        '^': ['^'],
        A: ['^', '>'],
        '<': ['<'],
        '>': ['>'],
        v: [],
    },
    '^': {
        A: ['>'],
        v: ['v'],
        '<': ['v', '<'],
        '>': ['>', 'v'],
        '^': [],
    },
    A: {
        '^': ['<'],
        v: ['v', '<'],
        '<': ['v', '<', '<'],
        '>': ['v'],
        A: [],
    },
    '<': {
        '^': ['>', '^'],
        A: ['>', '>', '^'],
        v: ['>'],
        '>': ['>', '>'],
        '<': [],
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

const routes = ['029A', '980A', '179A', '456A', '379A'] // test
//const routes = ['540A', '839A', '682A', '826A', '974A'] //real
// const routes = ['029A']
//const routes = ['286A', '974A', '189A', '802A', '805A'] // mika
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
        return prev + abba[startCoord][curr].join('') + A
    }, '')
}

const res = routes.reduce((prev, route) => {
    const allRoutesAsString = handleStep(route, numPad)

    let tempSteps = allRoutesAsString
    let i = 0
    while (i < 12) {
        tempSteps = tempSteps.map((node) => {
            return secondarySteps(node)
        })
        i++
    }

    const finalScore = tempSteps.reduce(
        (prev, node) => Math.min(prev, node.length),
        Infinity
    )
    console.log({ finalScore })
    const other = Number(route.split('').splice(0, 3).join(''))
    return prev + finalScore * other
}, 0)
console.log(res)
