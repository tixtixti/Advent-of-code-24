const fs = require('node:fs').promises

const UP = '^'
const DOWN = 'v'
const RIGHT = '>'
const LEFT = '<'
const FLOOR = '.'
const WALL = '#'
const BARREL = 'O'
const ROBOT = '@'

async function main(filename) {
    const arrayBase = (await fs.readFile(filename, 'utf8'))
        .split('\n')
        .filter((node) => node !== '')
    const inputs = arrayBase
        .filter((node) => node[0] !== '#')
        .map((line) => line.split(''))
        .flat()
    const map = arrayBase
        .filter((node) => node[0] === '#')
        .map((line) => line.split(''))
    const [start] = findStartingPoint(map)

    let currentPosition = [...start]
    let traverseMap = [...map]
    for (let index = 0; index < inputs.length; index++) {
        const nextInput = inputs[index]
        const y = currentPosition[0]
        const x = currentPosition[1]
        const currentTile = traverseMap[y][x]
        // console.log({ currentPosition, currentTile, nextInput })

        const [uusiY, uusiX] = getNextPoint(nextInput, currentPosition)
        const nextPosition = [uusiY, uusiX]
        const nextTile = traverseMap[uusiY][uusiX]
        if (nextTile === WALL) {
            // do nothing
        } else if (nextTile === BARREL) {
            const [updatedMap, stop] = findNextFreeSlot(
                nextInput,
                traverseMap,
                nextPosition
            )
            traverseMap = updatedMap
            if (!stop) {
                currentPosition = [uusiY, uusiX]
            }

            //  printMap(traverseMap)
        } else {
            currentPosition = [uusiY, uusiX]
        }
    }
    //  printMap(traverseMap)
    const result = findAllOccureances(traverseMap, 'O').reduce(
        (prev, [y, x]) => {
            return prev + y * 100 + x
        },
        0
    )
    return result
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

const findAllOccureances = (allInOne, symbol = '@') => {
    const startingCoords = []
    allInOne.forEach((line, index) => {
        line.reduce(function (a, e, i) {
            if (e === symbol) a.push(i)
            return a
        }, []).forEach((indexx) => {
            startingCoords.push([index, indexx])
        })
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

const printMap = (map) => {
    console.log('////')
    console.log(map.map((line) => line.join('')).join('\n'))
}
const findNextFreeSlot = (direction, map, position) => {
    // position on barrel
    let updatePosition = [...position]
    let visitedBarrels = []

    while (true) {
        const [uusiY, uusiX] = getNextPoint(direction, updatePosition)
        const nextTile = map[uusiY][uusiX]
        updatePosition = [uusiY, uusiX]
        // console.log({ position, direction, nextTile })
        if (nextTile === FLOOR) {
            map[position[0]][position[1]] = '.'
            map[updatePosition[0]][updatePosition[1]] = 'O'
            //  console.log({ position, updatePosition })
            return [map]
        }
        if (nextTile === WALL) {
            return [map, true]
        }
        if (nextTile === BARREL) {
            visitedBarrels.push(position)
            // or nothing
        }
        updatePosition = [uusiY, uusiX]
    }
}
module.exports = main
