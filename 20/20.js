const fs = require('node:fs').promises
//const FILENAME = 'test.txt'
const FILENAME = 'input.txt'
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

    let { openList, closedList } = initializeAStar(start, end)
    let pathFound = false
    let baseRoute = null
    let baseRouteG = null
    while (!pathFound) {
        pathFound = aStartStepHandler(openList, closedList, graph, end)
        if (pathFound) {
            baseRoute = pathFound[0]
            baseRouteG = pathFound[1]
        }
    }
    let interableArray = []
    baseRoute.forEach((baseRoute, index, self) => {
        interableArray.push({
            route: baseRoute,
            g: baseRouteG[index],
        })
    })
    //console.log(interableArray)
    // console.log({ baseRouteG, baseRoute })

    let current = interableArray.shift()
    let sum = 0
    while (interableArray.length > 0) {
        let nodesInRadius = interableArray.filter((next) =>
            nodesWithinDistance(current.route, next.route, 20)
        )

        let validNodes = nodesInRadius.filter(
            (next) =>
                next.g -
                    current.g -
                    getManhattanValue(current.route, next.route) >=
                100
        )

        sum += validNodes.length

        current = interableArray.shift()
    }
    console.log(sum)
}
main()
const nodesWithinDistance = (node1, node2, distance) => {
    return getManhattanValue(node1, node2) <= distance
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
        g: 0,
        f: manhattanValueStart, // h + g
        route: [start],
        gRoute: [0],
    })
    return { openList, closedList }
}
const aStartStepHandler = (openList, closedList, filledGraph, end) => {
    if (openList.length === 0) {
        return false
    }
    const bestNode = openList.sort((a, b) => b.f - a.f).pop()
    if (bestNode.position.toString() === end.toString()) {
        // console.log('DONE ZO', bestNode.route)
        return [bestNode.route, bestNode.gRoute]
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
                    route: [...bestNode.route, neighbor],
                    gRoute: [...bestNode.gRoute, newG],
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
