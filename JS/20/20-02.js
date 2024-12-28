const fs = require('node:fs').promises
const FILENAME = 'test.txt'
//const FILENAME = 'input.txt'
//const FILENAME = 'smallInput.txt'
const FLOOR = '.'
const WALL = '#'

const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
]

async function main() {
    const input = (await fs.readFile(FILENAME, 'utf8')).split('\n')

    const graph = input.map((line) => line.split(''))
    const start = findStartingPoint(graph, 'S').flat()
    const end = findStartingPoint(graph, 'E').flat()

    const height = input.length
    const width = input[0].length
    const allWalls = findAllOccurances(graph, WALL)
    /*
    const cheatWalls = allWalls.filter(
        (node) => getNeighbors(graph, node).length > 1
    )
        */

    let { openList, closedList } = initializeAStar(start, end)
    let pathFound = false
    let baseRouteG = 0
    const hardCounter = 100
    while (!pathFound) {
        pathFound = aStartStepHandler(openList, closedList, graph, end)
        if (pathFound) {
            baseRouteG = pathFound
        }
    }
    pathFound = false
    const cheatScores = new Map()

    const cheatsWithoutSides = allWalls.filter((node) => {
        if (
            node[0] === 0 ||
            node[0] === width - 1 ||
            node[1] === 0 ||
            node[1] === height - 1
        ) {
            return false
        }
        return true
    })
    // etsi reitti --> lisää kivet --> tallenna kivet + aloitus + aika
    // etsi retti --> lisää kivet
    // ...
    // kunnes kivet loppuu?

    console.log(cheatsWithoutSides)
    let emptyMap = JSON.parse(JSON.stringify(graph))
    cheatsWithoutSides.forEach((node) => {
        inputPosition(emptyMap, node, FLOOR)
    })
    /*
    for (let index = 0; index < cheatWalls.length; index++) {
        const cheatWall = cheatWalls[index]

        const cheatGraph = JSON.parse(JSON.stringify(graph))
        inputPosition(cheatGraph, cheatWall, FLOOR)

        const { openList, closedList } = initializeAStar(start, end)
        let pathFound = false
        while (!pathFound) {
            pathFound = aStartStepHandler(openList, closedList, cheatGraph, end)
            if (pathFound) {
                const key = baseRouteG - pathFound
                if (cheatScores.get(key)) {
                    cheatScores.set(key, cheatScores.get(key) + 1)
                } else {
                    cheatScores.set(key, 1)
                }
            }
        }
    }    const ab = Array.from(cheatScores.keys())
    const res = ab.reduce((prev, curr) => {
        if (curr >= hardCounter) {
            return prev + cheatScores.get(curr)
        }
        return prev
    }, 0)
        */
    printMap(graph)
    printMap(emptyMap)
}
main()

const findAllOccurances = (array2d, entity) => {
    let positions = []
    array2d.forEach((row, Yindex) => {
        row.forEach((node, Xindex) => {
            if (node == entity) {
                positions.push([Yindex, Xindex])
            }
        })
    })
    return positions
}

const findStartingPoint = (allInOne, symbol = '@') => {
    const startingCoords = []
    allInOne.forEach((node, index) => {
        if (node.includes(symbol)) {
            startingCoords.push([index, node.indexOf(symbol)])
        }
    })
    return startingCoords
}
const readPosition = (map, node) => map[node[0]] && map[node[0]][node[1]]

const printMap = (map) => {
    let printMap = [...map]
    console.log('////')
    console.log(printMap.map((line) => line.join('')).join('\n'))
}
const inputPosition = (grid, [y, x], value) => (grid[y][x] = value)

const getNeighbors = (filledGraph, [y, x]) => {
    const neighbors = []

    directions.forEach(([directionY, directionX]) => {
        const newX = x + directionX
        const newY = y + directionY

        const location = readPosition(filledGraph, [newY, newX])

        if (location === FLOOR || location === 'S' || location === 'E') {
            neighbors.push([newY, newX])
        }
    })
    return neighbors
}

const getManhattanValue = ([ny, nx], end) => {
    const [gy, gx] = end
    return Math.abs(gx - nx) + Math.abs(gy - ny)
}

const initializeAStar = (start, end) => {
    const openList = []
    const closedList = new Set()
    const manhattanValueStart = getManhattanValue(start, end)
    openList.push({
        position: start,
        h: manhattanValueStart,
        g: 0, // or should we do read pos?
        f: manhattanValueStart, // h + g
    })
    return { openList, closedList }
}
const aStartStepHandler = (openList, closedList, filledGraph, end) => {
    if (openList.length === 0) {
        return false
    }
    const bestNode = openList.sort((a, b) => b.f - a.f).pop()
    if (bestNode.position.toString() === end.toString()) {
        // console.log('DONE ZO', bestNode)
        return bestNode.g
    }
    const neighbors = getNeighbors(filledGraph, bestNode.position)

    neighbors.forEach((neighbor) => {
        if (!closedList.has(neighbor.toString())) {
            const newG = bestNode.g + 1
            const newH = getManhattanValue(neighbor, end)
            const newF = newG + newH

            const existingValues = openList.find(
                (node) => node.position === neighbor
            )

            if (!existingValues) {
                openList.push({
                    position: neighbor,
                    h: newH,
                    g: newG,
                    f: newF,
                })
            } else if (newG < existingValues.g) {
                const indexOfExisting = openList.findIndex(
                    (node) => node.position === neighbor
                )

                openList[indexOfExisting] = {
                    position: neighbor,
                    h: newH,
                    g: newG,
                    f: newF,
                }
            }
        }
    })
    closedList.add(bestNode.position.toString())
    return false
}
