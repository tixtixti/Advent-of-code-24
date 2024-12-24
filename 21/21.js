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

const calculateSingleInputTimes = (char, prev, temp, i) => {
    if (i === 0) {
        console.log(temp, char, prev)
        return temp
    }
    //  const key = `${char}_${i}`

    let allChanges = abba[prev][char]
    let result = 0
    allChanges.forEach((change) => {
        result += calculateSingleInputTimes(
            change,
            char,
            temp + allChanges.length,
            i - 1
        )
    })
    return result
}
/*
const res = routes.reduce((prev, route) => {
    const allRoutesAsString = handleStep(route, numPad)

    let tempSteps = allRoutesAsString[2]
    console.log(tempSteps)

    // let result = 0
    //const stack = []

    // Initialize the stack
    const result = tempSteps.split('').reduce((prev, node, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]
        const ab = calculateSingleInputTimes(node, startCoord, 0, 1)
        return prev + ab
    }, 0)

    /*
    const finalScore = tempSteps.reduce(
        (prev, node) => Math.min(prev, node.length),
        20000
    )

    console.log({ result })
    const other = Number(route.split('').splice(0, 3).join(''))
    return prev + result * other
}, 0)
*/
const ab = calculateSingleInputTimes('^', 'A', 0, 1)
console.log(ab)
//console.log(res)

// ['v', '<', '<', 'A']
//
