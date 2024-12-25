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

const secondaryStepsRecGPT = (routes, rounds) => {
    const buildPaths = (route) => {
        return route.map((node) => {
            let result = ''
            for (let i = 0; i < node.length; i++) {
                const startCoord = i === 0 ? A : node[i - 1]
                const curr = node[i]
                result += abba[startCoord][curr].join('')
            }
            return result
        })
    }

    let currentRoutes = routes

    for (let i = 0; i < rounds; i++) {
        currentRoutes = buildPaths(currentRoutes)
    }

    return currentRoutes
}

const res = routes.reduce((prev, route) => {
    const finalScore = handleStep(route, numPad)
        .map((node) => secondaryStepsRecGPT([node], 2))
        .flat()
        .reduce((prev, node) => Math.min(prev, node.length), Infinity)

    const other = Number(route.split('').splice(0, 3).join(''))
    return prev + finalScore * other
}, 0)
console.log(res)
