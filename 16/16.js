const fs = require('node:fs').promises

const UP = '^'
const DOWN = 'v'
const RIGHT = '>'
const LEFT = '<'
const FLOOR = '.'
const WALL = '#'

async function main(filename) {
    const map = (await fs.readFile(filename, 'utf8'))
        .split('\n')
        .map((line) => line.split(''))
    const start = findStartingPoint(map, 'S').flat()

    const emptyStackItem = {
        currentPosition: start,
        sum: 0,
        direction: RIGHT,
        pathTaken: [],
    }
    const minValuesPerNode = new Map()
    const stack = [{ ...emptyStackItem }]

    // let currentMim = Number.MAX_SAFE_INTEGER
    let currentMim = 742316 // lol
    while (stack.length > 0) {
        const currentNode = { ...stack.pop() }
        //console.log(currentNode.currentPosition)

        if (
            !checkPerNode(
                minValuesPerNode,
                currentNode.currentPosition,
                currentNode.sum
            )
        ) {
            continue
        }
        if (
            currentNode.pathTaken.includes(
                currentNode.currentPosition.toString()
            )
        ) {
            continue
        }
        currentNode.pathTaken.push(currentNode.currentPosition.toString())

        currentLocation = readPosition(map, currentNode.currentPosition)
        if (!currentLocation) {
            // console.log('out of bounds')
            continue
        }

        // kill if too expensive
        if (currentNode.sum > currentMim) {
            // console.log(currentNode.sum)
            continue
        }

        if (currentLocation === '#') {
            continue
        }
        if (currentLocation === 'E') {
            // console.log(currentNode.pathTaken, currentNode.pathTaken.length)
            currentMim = Math.min(currentMim, currentNode.sum)
            continue
        }

        // has to be floor
        const nextPosition = getNextPoint(
            currentNode.direction,
            currentNode.currentPosition
        )
        if (readPosition(map, nextPosition)) {
            stack.push({
                currentPosition: nextPosition,
                sum: currentNode.sum + 1,
                direction: currentNode.direction,
                pathTaken: [...currentNode.pathTaken],
            })

            const [newClockwise, newCounterClockwise] = getNextDirection(
                currentNode.direction
            )
            const newClockwiseCoord = getNextPoint(
                newClockwise,
                currentNode.currentPosition
            )
            const newCounterClockwiseCoords = getNextPoint(
                newCounterClockwise,
                currentNode.currentPosition
            )

            const newClockwiseLocation = newClockwiseCoord
                ? readPosition(map, newClockwiseCoord)
                : null
            const newCounterClockwiseLocation = newCounterClockwiseCoords
                ? readPosition(map, newCounterClockwiseCoords)
                : null

            if (newClockwiseLocation === FLOOR) {
                stack.push({
                    currentPosition: newClockwiseCoord,
                    sum: currentNode.sum + 1001,
                    direction: newClockwise,
                    pathTaken: [...currentNode.pathTaken],
                })
            }
            if (newCounterClockwiseLocation === FLOOR) {
                stack.push({
                    currentPosition: newCounterClockwiseCoords,
                    sum: currentNode.sum + 1001,
                    direction: newCounterClockwise,
                    pathTaken: [...currentNode.pathTaken],
                })
            }
        }
    }
    return currentMim
}
module.exports = main

// pudota jos käyty jo ruutu
// pudota jos summa menee yli
// jokainen käännös luo uuden

// 1 step 1 piste
// 1 käännös 1000 pistettä
// yksi käännös per vuoro 90 asetta molemmat suunnat.
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

const getNextPoint = (direction, currentPosition) => {
    if (direction === UP) {
        return [currentPosition[0] - 1, currentPosition[1]]
    }
    if (direction === RIGHT) {
        return [currentPosition[0], currentPosition[1] + 1]
    }
    if (direction === DOWN) {
        return [currentPosition[0] + 1, currentPosition[1]]
    }
    if (direction === LEFT) {
        return [currentPosition[0], currentPosition[1] - 1]
    }
}

const getNextDirection = (direction) => {
    switch (direction) {
        case UP:
            return [RIGHT, LEFT]
        case RIGHT:
            return [DOWN, UP]
        case DOWN:
            return [LEFT, RIGHT]
        case LEFT:
            return [UP, DOWN]
    }
    throw new Error('Impossible')
}

const checkPerNode = (mapMap, currentPos, currentSum) => {
    const key = currentPos.toString()
    const sumPerNode = mapMap.get(key)
    if (sumPerNode) {
        if (currentSum > sumPerNode) {
            return false
        }
        mapMap.set(key, Math.min(sumPerNode, currentSum))
    } else {
        mapMap.set(key, currentSum)
    }
    return true
}
