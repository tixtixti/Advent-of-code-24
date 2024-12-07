const fs = require('node:fs').promises

const UP = '^'
const DOWN = 'v'
const RIGHT = '>'
const LEFT = '<'
const FLOOR = '.'
const WALL = '#'

async function main() {
    try {
        const data = await fs.readFile('input.txt', 'utf8')

        const allInOne = data.split('\n')
        const matrix2d = allInOne.map((node) => node.split(''))

        const start = findStartingPoint(allInOne)

        let loops = []

        const startStack = {
            currentPoint: [start[0] - 1, start[1]], // move start one up
            hasSplit: false,
            visitedPoints: [start[0] - 1, start[1]], // move start one up
            direction: UP,
            splitPoint: null,
        }
        const stack = [{ ...startStack }]
        while (stack.length > 0) {
            const currentStack = { ...stack.pop() }
            const currentCoord = currentStack.currentPoint

            if (hasSubArrayAtLeastThreeTimes(currentStack.visitedPoints)) {
                loops.push(currentStack.splitPoint)

                continue
            }
            if (!matrix2d[currentCoord[0]]) {
                continue
            }
            const current = matrix2d[currentCoord[0]][currentCoord[1]]
            if (!current) {
                continue
            }
            switch (current) {
                case UP:
                case FLOOR: {
                    // . ei olla splitattu
                    if (!currentStack.hasSplit) {
                        const nextPoint = getNextPoint(
                            currentStack.direction,
                            currentCoord
                        )
                        stack.push(
                            getNewStackItem(nextPoint, { ...currentStack })
                        )

                        const { newDirection, newPoint } =
                            handleWall(currentStack)
                        stack.push(
                            getNewStackItem(
                                newPoint,
                                { ...currentStack },
                                newDirection,
                                true,
                                currentStack.currentPoint
                            )
                        )
                        break
                        // . ollaan splitattu ja ollaan uudestaan kohtessa,
                    } else if (
                        currentStack.splitPoint.toString() ===
                        currentCoord.toString()
                    ) {
                        const { newDirection, newPoint } =
                            handleWall(currentStack)
                        stack.push(
                            getNewStackItem(
                                newPoint,
                                currentStack,
                                newDirection
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
                    const { newDirection, newPoint } = handleWall(currentStack)
                    stack.push(
                        getNewStackItem(newPoint, currentStack, newDirection)
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
    nextPoint2 = false
) => {
    return {
        ...oldStack,
        currentPoint: nextPoint,
        visitedPoints: [...oldStack.visitedPoints, nextPoint],
        direction: newDirection ? newDirection : oldStack.direction,
        hasSplit: flipSplit ? !oldStack.hasSplit : oldStack.hasSplit,
        splitPoint: nextPoint2 ? nextPoint2 : oldStack.splitPoint,
    }
}

function hasSubArrayAtLeastThreeTimes(array) {
    const frequencyMap = new Map()

    for (let index = 0; index < array.length; index++) {
        const item = array[index]

        const key = JSON.stringify(item) // Convert the sub-array to a string key
        const count = (frequencyMap.get(key) || 0) + 1

        if (count === 3) {
            if (!array[index - 30]) {
                return false
            }

            let allGood = true
            for (let idd = 0; idd < 30; idd++) {
                if (!allGood) {
                    continue
                }
                const count2 = frequencyMap.get(
                    JSON.stringify(array[index - idd])
                )
                if (count2 < 2) {
                    allGood = false
                }
            }
            if (allGood) {
                return true
            }
        }

        frequencyMap.set(key, count)
    }

    return false // No sub-array appears 3 times
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

main()
