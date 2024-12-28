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

        const stack = [[start[0], start[1]]]

        let direction = UP
        const visited = new Set()
        while (stack.length > 0) {
            const currentCoord = stack.pop()

            if (!matrix2d[currentCoord[0]]) {
                return visited.size
            }
            const current = matrix2d[currentCoord[0]][currentCoord[1]]
            if (!current) {
                return visited.size
            }
            switch (current) {
                case UP:
                case FLOOR: {
                    visited.add(currentCoord.toString())
                    stack.push(getNextPoint(direction, currentCoord))
                    break
                }

                case WALL: {
                    if (direction === UP) {
                        direction = RIGHT
                        stack.push([currentCoord[0] + 1, currentCoord[1] + 1])
                        break
                    }
                    if (direction === RIGHT) {
                        direction = DOWN
                        stack.push([currentCoord[0] + 1, currentCoord[1] - 1])
                        break
                    }
                    if (direction === DOWN) {
                        direction = LEFT
                        stack.push([currentCoord[0] - 1, currentCoord[1] - 1])
                        break
                    }
                    if (direction === LEFT) {
                        direction = UP
                        stack.push([currentCoord[0] - 1, currentCoord[1] + 1])
                        break
                    }
                    break
                }
            }
        }
        return counter
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
