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
            hasSplit: false,
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
                // console.log('exit')
                continue
            }
            const current = matrix2d[currentCoord[0]][currentCoord[1]]
            if (!current) {
                //  console.log('exit')
                continue
            }
            switch (current) {
                case '^':
                case FLOOR: {
                    // . ei olla splitattu
                    if (!currentStack.hasSplit) {
                        // jatka normaalisti
                        const nextPoint = getNextPoint(
                            currentStack.direction,
                            currentCoord
                        )
                        stack.push(
                            getNewStackItem(nextPoint, { ...currentStack })
                        )
                        // ja splittaa kivellä
                        if (barrels.has(currentStack.currentPoint.toString())) {
                            console.log('oltiin jo')
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
                                true,
                                currentStack.currentPoint,
                                false,
                                true
                            )
                        )
                        break
                        // . ollaan splitattu ja ollaan uudestaan kohtessa,
                    } else if (
                        currentStack.splitPoint.toString() ===
                        currentCoord.toString()
                    ) {
                        // console.log('custom wall')
                        // deteck loop and kill
                        if (detectLoop(currentStack)) {
                            loops.push(currentStack.splitPoint)
                            console.log(loops.length)
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
                                false,
                                true,
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
                    // console.log(currentStack.currentPoint)
                    if (detectLoop(currentStack)) {
                        loops.push(currentStack.splitPoint)
                        console.log(loops.length)

                        continue
                    }
                    const { newDirection, newPoint } = handleWall(currentStack)
                    stack.push(
                        getNewStackItem(
                            newPoint,
                            currentStack,
                            newDirection,
                            false,
                            false,
                            false,
                            true
                        )
                    )
                    break
                }
            }
        }
        console.log(loops.length)
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
    flipSplit = false,
    nextPoint2 = false,
    comingToOurWallFromDirection = false,
    isWall = false
) => {
    let splitDirection = null
    let newWalls = []
    if (flipSplit) {
        splitDirection = [oldStack.direction]
    } else if (comingToOurWallFromDirection) {
        splitDirection = [...oldStack.splitDirection, oldStack.direction]
    } else {
        splitDirection = oldStack.splitDirection
    }

    if (isWall) {
        newWalls = [
            ...oldStack.wallsAfterSplit,
            `${oldStack.currentPoint.toString()}+${oldStack.direction}`,
        ]
    }

    return {
        ...oldStack,
        currentPoint: nextPoint,
        visitedPoints: [...oldStack.visitedPoints, nextPoint],
        direction: newDirection ? newDirection : oldStack.direction,
        hasSplit: flipSplit ? !oldStack.hasSplit : oldStack.hasSplit,
        splitPoint: nextPoint2 ? nextPoint2 : oldStack.splitPoint,
        splitDirection,
        wallsAfterSplit: isWall ? newWalls : oldStack.wallsAfterSplit,
    }
}

const detectLoop = (stackItem) => {
    if (
        stackItem.wallsAfterSplit.includes(
            `${stackItem.currentPoint.toString()}+${stackItem.direction}`
        )
    ) {
        //   console.log('neljän seinän looppi')

        return true
    }
    return false
    return (
        stackItem.hasSplit &&
        stackItem.splitDirection.includes(stackItem.direction) &&
        stackItem.splitPoint.toString() === stackItem.currentPoint.toString()
    )
}

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

function createFIFOSlots(maxSlots = 4) {
    const slots = [] // Initialize an empty array

    return {
        add(subarray) {
            if (slots.length >= maxSlots) {
                slots.shift() // Remove the oldest subarray (FIFO behavior)
            }
            slots.push(subarray.toString()) // Add the new subarray to the end
        },
        getSlots() {
            return [...slots] // Return a copy of the slots
        },
    }
}
main()
