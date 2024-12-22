const { readPosition } = require('./GraphLibrary.js')
const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
]

const getNeighbors = (filledGraph, [y, x]) => {
    const neighbors = []
    const directionsArray = []

    directions.forEach(([directionY, directionX], index) => {
        const newX = x + directionX
        const newY = y + directionY
        const location = readPosition(filledGraph, [newY, newX])

        if (location) {
            neighbors.push([newY, newX])
            directionsArray.push(getDirectionByIndex(index))
        }
    })
    return [neighbors, directionsArray]
}
const getDirectionByIndex = (index) => {
    switch (index) {
        case 0:
            return '^'
        case 1:
            return 'v'
        case 2:
            return '<'
        case 3:
            return '>'
    }
}

const getManhattanValue = ([ny, nx], end) => {
    const [gy, gx] = end
    return Math.abs(gx - nx) + Math.abs(gy - ny)
}

const initializeAStar = (start, end, filledGraph) => {
    const openList = []
    const closedList = new Set()
    // Get the neighbors and directions for the start node
    const [neighbors, directionsArray] = getNeighbors(filledGraph, start)
    let initialDirection
    const manhattanValueStart = getManhattanValue(start, end)
    if (
        readPosition(filledGraph, start) === 'A' &&
        readPosition(filledGraph, end) == '0'
    ) {
        initialDirection = '^'
    } else {
        directionsArray.length > 0 ? directionsArray[0] : null
    }
    // Dynamically select the initial direction (first valid neighbor's direction)

    openList.push({
        position: start,
        h: manhattanValueStart,
        g: 0, // or should we do read pos?
        f: manhattanValueStart, // h + g
        route: [],
        lastDirectionInRoute: initialDirection, // path taken
    })
    return { openList, closedList }
}
const aStartStepHandler = (openList, closedList, filledGraph, end) => {
    if (openList.length === 0) {
        return false
    }
    const bestNode = openList.sort((a, b) => a.f - b.f).shift()
    if (bestNode.position.toString() === end.toString()) {
        // console.log('DONE ZO', bestNode)
        return bestNode.route
    }
    const [neighbors, nbArray] = getNeighbors(filledGraph, bestNode.position)

    neighbors.forEach((neighbor, index) => {
        const nbDirection = nbArray[index]
        const lastDirection = bestNode.lastDirectionInRoute
        const goingSameDirection = nbDirection === lastDirection
        let directionG = goingSameDirection ? 0 : 5

        const directionPreferenceCost =
            nbDirection === '^' || nbDirection === 'v' ? 0 : 10
        if (!closedList.has(neighbor.toString())) {
            const newG = bestNode.g + 1
            const newH = getManhattanValue(neighbor, end)
            const newF = newG + newH + directionG + directionPreferenceCost

            // Check if the neighbor is in the open list
            const existingValues = openList.find(
                (node) => node.position.toString() === neighbor.toString()
            )

            if (!existingValues) {
                openList.push({
                    position: neighbor,
                    h: newH,
                    g: newG,
                    f: newF,
                    route: [...bestNode.route, nbDirection],
                    lastDirectionInRoute: nbDirection,
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
                    route: [...bestNode.route],
                    lastDirectionInRoute: lastDirection,
                }
            }
        }
    })
    closedList.add(bestNode.position.toString())
    return false
}

module.exports.getNeighbors = getNeighbors
module.exports.getManhattanValue = getManhattanValue
module.exports.initializeAStar = initializeAStar
module.exports.aStartStepHandler = aStartStepHandler
