const fs = require('node:fs').promises

const FLOOR = '.'
const WALL = '#'
/*
const GRID_WIDTH = 7
const bytes = 12
const GOAL_COORDS = [6, 6]
const start = [0, 0]
const filename = 'testInput.txt'
*/

const GRID_WIDTH = 71
const bytes = 1024
const GOAL_COORDS = [70, 70]
const start = [0, 0]
const filename = 'input.txt'

const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
]

const main = async () => {
    const input = await fs.readFile(filename, 'utf8')

    const graph = createGraph()
    const filledGraph = fillGraph(graph, input)

    const gValues = initializeGValues(filledGraph)
    inputPosition(gValues, start, 0)

    const { openList, closedList } = initializeAStar()

    let pathFound = false
    while (!pathFound) {
        pathFound = aStartStepHandler(openList, closedList, filledGraph)
    }
}
const createGraph = () => {
    const arrayMap = [...Array(GRID_WIDTH)].map(() => [
        ...Array(GRID_WIDTH).fill(FLOOR),
    ])
    return arrayMap
}
const fillGraph = (graph, input) => {
    const copyOfGraph = [...graph]

    input.split('\n').forEach((node, index) => {
        if (index < bytes) {
            const [x, y] = node.split(',').map(Number)
            copyOfGraph[y][x] = WALL
        }
    })
    return copyOfGraph
}
const printMap = (map) => {
    let printMap = [...map]
    console.log('////')
    console.log(printMap.map((line) => line.join('')).join('\n'))
}
const readPosition = (map, [y, x]) => map[y] && map[y][x]
const inputPosition = (grid, [y, x], value) => (grid[y][x] = value)

const getNeighbors = (filledGraph, [y, x]) => {
    const neighbors = []

    directions.forEach(([directionY, directionX]) => {
        const newX = x + directionX
        const newY = y + directionY

        const location = readPosition(filledGraph, [newY, newX])

        if (location === FLOOR) {
            neighbors.push([newY, newX])
        }
    })
    return neighbors
}
const getManhattanValue = ([ny, nx]) => {
    const [gy, gx] = GOAL_COORDS
    return Math.abs(gx - nx) + Math.abs(gy - ny)
}

const initializeGValues = (filledGraph) => {
    return filledGraph.map((row) => row.map(() => Infinity))
}
const initializeAStar = () => {
    const openList = []
    const closedList = new Set()
    const manhattanValueStart = getManhattanValue(start)
    openList.push({
        position: start,
        h: manhattanValueStart,
        g: 0, // or should we do read pos?
        f: manhattanValueStart, // h + g
    })
    return { openList, closedList }
}
const aStartStepHandler = (openList, closedList, filledGraph) => {
    if (openList.length === 0) {
        return false
    }
    const bestNode = openList.sort((a, b) => b.f - a.f).pop()
    //console.log('explored', bestNode)
    if (bestNode.position.toString() === GOAL_COORDS.toString()) {
        console.log('DONE ZO', bestNode)
        return true
    }
    const neighbors = getNeighbors(filledGraph, bestNode.position)

    neighbors.forEach((neighbor) => {
        if (!closedList.has(neighbor.toString())) {
            const newG = bestNode.g + 1
            const newH = getManhattanValue(neighbor)
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

main()
