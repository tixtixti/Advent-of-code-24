const fs = require('node:fs').promises

const UP = 'UP'
const DOWN = 'DOWN'
const RIGHT = 'RIGHT'
const LEFT = 'LEFT'
const FLOOR = '.'
const WALL = '#'

async function main() {
    try {
        const data = await fs.readFile('input.txt', 'utf8')

        const allInOne = data.split('\n')
        const matrix2d = allInOne.map((node) => node.split(''))

        const start = findStartingPoint(allInOne)

        let barrels = new Set()
        let loops = []

        const startStack = {
            currentPoint: [start[0], start[1]], // move start one up
            visitedPoints: [start[0], start[1]], // move start one up
            direction: UP,
            splitPoint: null,
            wallsAfterSplit: [],
        }
        const stack = [{ ...startStack }]
        while (stack.length > 0) {
            const currentStack = { ...stack.pop() }
            const currentCoord = currentStack.currentPoint

            if (!matrix2d[currentCoord[0]]) {
                continue
            }
            const current = matrix2d[currentCoord[0]][currentCoord[1]]
            if (!current) {
                continue
            }
            switch (current) {
                case '^':
                case FLOOR: {
                    // . ei olla splitattu
                    if (!currentStack.splitPoint) {
                        // jatka normaalisti
                        const nextPoint = getNextPoint(
                            currentStack.direction,
                            currentCoord
                        )
                        stack.push(
                            getNewStackItem(nextPoint, { ...currentStack })
                        )
                        // ja splittaa kivellä, vain jos siinä ei oo jo kiveä
                        if (barrels.has(currentStack.currentPoint.toString())) {
                            break
                        } else {
                            barrels.add(currentStack.currentPoint.toString())
                        }
                        const { newDirection, newPoint } =
                            handleWall(currentStack)
                        stack.push(
                            getNewStackItem(
                                newPoint,
                                { ...currentStack },
                                newDirection,
                                currentStack.currentPoint,
                                true
                            )
                        )
                        break
                        // . ollaan splitattu ja ollaan uudestaan kohtessa,
                    } else if (
                        currentStack.splitPoint.toString() ===
                        currentCoord.toString()
                    ) {
                        if (detectLoop(currentStack)) {
                            loops.push(currentStack.splitPoint)
                            continue
                        }

                        const { newDirection, newPoint } =
                            handleWall(currentStack)

                        stack.push(
                            getNewStackItem(
                                newPoint,
                                currentStack,
                                newDirection,
                                false,
                                true
                            )
                        )
                        break
                    } else {
                        // . ollaan splitattu

                        const nextPoint = getNextPoint(
                            currentStack.direction,
                            currentCoord
                        )
                        stack.push(
                            getNewStackItem(nextPoint, { ...currentStack })
                        )
                        break
                    }
                }

                case WALL: {
                    if (detectLoop(currentStack)) {
                        loops.push(currentStack.splitPoint)
                        continue
                    }
                    const { newDirection, newPoint } = handleWall(currentStack)
                    stack.push(
                        getNewStackItem(
                            newPoint,
                            currentStack,
                            newDirection,
                            false,
                            true
                        )
                    )
                    break
                }
            }
        }
        return loops
    } catch (e) {
        console.log(e)
    }
}

module.exports = main

const findStartingPoint = (allInOne) => {
    const startingCoords = []
    allInOne.forEach((node, index) => {
        if (node.includes('^')) {
            startingCoords.push(index, node.indexOf('^'))
        }
    })
    return startingCoords
}

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
const getNewStackItem = (
    nextPoint,
    oldStack,
    newDirection,
    nextPoint2 = false,
    isWall = false
) => {
    return {
        ...oldStack,
        currentPoint: nextPoint,
        visitedPoints: [...oldStack.visitedPoints, nextPoint],
        direction: newDirection ? newDirection : oldStack.direction,
        splitPoint: nextPoint2 ? nextPoint2 : oldStack.splitPoint,
        wallsAfterSplit: isWall
            ? [
                  ...oldStack.wallsAfterSplit,
                  `${oldStack.currentPoint.toString()}+${oldStack.direction}`,
              ]
            : oldStack.wallsAfterSplit,
    }
}

const detectLoop = (stackItem) =>
    stackItem.wallsAfterSplit.includes(
        `${stackItem.currentPoint.toString()}+${stackItem.direction}`
    )

const handleWall = (currentStack) => {
    const currentCoord = currentStack.currentPoint
    const direction = currentStack.direction
    let newDirection = null
    let newPoint = null
    if (direction === UP) {
        newDirection = RIGHT
        newPoint = [currentCoord[0] + 1, currentCoord[1] + 1]
    }
    if (direction === RIGHT) {
        newDirection = DOWN
        newPoint = [currentCoord[0] + 1, currentCoord[1] - 1]
    }
    if (direction === DOWN) {
        newDirection = LEFT
        newPoint = [currentCoord[0] - 1, currentCoord[1] - 1]
    }
    if (direction === LEFT) {
        newDirection = UP
        newPoint = [currentCoord[0] - 1, currentCoord[1] + 1]
    }
    return { newDirection, newPoint }
}

main()
