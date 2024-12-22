const AStar = require('./AStar.js')
const GraphLibrary = require('./GraphLibrary.js')

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

const routes = ['029A', '980A', '179A', '456A', '379A'] // test
//const routes = ['540A', '839A', '682A', '826A', '974A'] //real
//const routes = ['179A']
//const routes = ['456A']

// eka setti breah first ja sitten vaan käyt kaikki läpi?`
const handleStep = (route, graph) => {
    return route.split('').reduce((prev, curr, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]
        let pathFound = false
        /*
        if (startCoord == A && curr == 4) {
            pathFound = ['^', '^', '<', '<']
        }
        if (startCoord == 4 && curr == A) {
            pathFound = ['v', 'v', '>', '>']
        }
        if (startCoord == 2 && curr == A) {
            pathFound = ['v', '>']
        }
        if (startCoord == 8 && curr == 3) {
            pathFound = ['v', 'v', '>']
        }
            */
        /*
        if (startCoord == A && curr == 8) {
            pathFound = ['<', '^', '^', '^']
        }
        if (startCoord == 6 && curr == 8) {
            pathFound = ['<', '^']
        }
        */
        const start = GraphLibrary.findStartingPoint(graph, startCoord).flat()
        const end = GraphLibrary.findStartingPoint(graph, curr).flat()

        let { openList, closedList } = AStar.initializeAStar(start, end, numPad)

        while (!pathFound) {
            pathFound = AStar.aStartStepHandler(
                openList,
                closedList,
                graph,
                end
            )
        }

        //console.log(pathFound.sort())
        return prev + pathFound.join('') + A
    }, '')
}

const secondarySteps = (route) => {
    //console.log(route)
    return route.split('').reduce((prev, curr, index, self) => {
        let startCoord = index === 0 ? A : self[index - 1]
        return prev + abba[startCoord][curr].join('') + A
    }, '')
}

const res = routes.reduce((prev, route) => {
    const summary = handleStep(route, numPad)
    console.log({ l: summary.length, summary, route })

    const dd = secondarySteps(summary)
    //const dd =
    //console.log({ l: dd.length, dd })

    const final = secondarySteps(dd)
    const other = Number(route.split('').splice(0, 3).join(''))
    console.log({ l: final.length, other, route })
    return prev + final.length * other
}, 0)
console.log(res) // too high 284652 284652 278028
//293356
