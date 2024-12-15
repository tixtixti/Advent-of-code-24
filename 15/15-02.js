const fs = require('node:fs').promises

const UP = '^'
const DOWN = 'v'
const RIGHT = '>'
const LEFT = '<'
const FLOOR = '.'
const WALL = '#'
const BARREL = 'O'
const ROBOT = '@'
const BARREL_START = '['
const BARREL_END = ']'

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
        .map((line) => {
            const normal = line.split('')
            return normal
                .map((node) => {
                    if (node === WALL) {
                        return [WALL, WALL]
                    }
                    if (node === FLOOR) {
                        return [FLOOR, FLOOR]
                    }
                    if (node === ROBOT) {
                        return [ROBOT, FLOOR]
                    }
                    if (node === BARREL) {
                        return ['[', ']']
                    }
                })
                .flat()
        })
    //console.log(map)
    //printMap(map)
    const [start] = findStartingPoint(map)
    map[start[0]][start[1]] = '.'
    // printMap(map)

    let currentPosition = [...start]
    let traverseMap = [...map]
    try {
        for (let index = 0; index < inputs.length; index++) {
            const nextInput = inputs[index]
            const [uusiY, uusiX] = getNextPoint(nextInput, currentPosition)
            const nextPosition = [uusiY, uusiX]
            const nextTile = traverseMap[uusiY][uusiX]
            if (nextTile === WALL) {
                // do nothing
            } else if (nextTile === BARREL_START || nextTile === BARREL_END) {
                const [updatedMap, stop] = findNextFreeSlot(
                    nextInput,
                    traverseMap,
                    nextPosition
                )
                traverseMap = updatedMap
                if (!stop) {
                    currentPosition = [uusiY, uusiX]
                }

                //  console.log({ nextPosition, nextInput })
                //   printMap([...traverseMap], currentPosition)
            } else {
                currentPosition = [uusiY, uusiX]
            }
        }
    } catch (e) {
        traverseMap[currentPosition[0]][currentPosition[1]] = ROBOT
        printMap(traverseMap)
        console.log({ currentPosition }, 'ERROR', e)
        return 0
    }
    //printMap(traverseMap)
    const result = findAllOccureances(traverseMap, '[').reduce(
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

const printMap = (map, currentPosition) => {
    let printMap = [...map]
    console.log('////')
    if (currentPosition) {
        // printMap[currentPosition[0]][currentPosition[1]] = '@'
    }
    console.log(printMap.map((line) => line.join('')).join('\n'))
}
const findNextFreeSlot = (direction, map, position) => {
    // position on barrel
    let updatePosition = [...position]
    let visitedBarrels = [
        { pos: position, node: map[position[0]][position[1]] },
    ]
    const positionsToFloor = []
    if (direction === UP || direction === DOWN) {
        const abba = handleItFinally(position, direction, map)
        if (!abba) {
            return [map, true]
        }
        abba.forEach((node) => {
            map[node.pos[0]][node.pos[1]] = FLOOR
        })
        abba.forEach((node) => {
            const modifierY =
                direction === UP ? node.pos[0] - 1 : node.pos[0] + 1
            map[modifierY][node.pos[1]] = node.type
        })
        return [map]
    }
    while (true) {
        const [uusiY, uusiX] = getNextPoint(direction, updatePosition)
        const nextTile = map[uusiY][uusiX]
        updatePosition = [uusiY, uusiX]

        // console.log({ position, direction, nextTile })
        if (nextTile === FLOOR) {
            map[position[0]][position[1]] = FLOOR // muuta lattiaksi

            //console.log({ visitedBarrels })
            positionsToFloor.forEach((floorNode) => {
                map[floorNode[0]][floorNode[1]] = FLOOR
            })
            visitedBarrels.forEach((barrelNode) => {
                const placeToMove = getNextPoint(direction, barrelNode.pos)
                map[placeToMove[0]][placeToMove[1]] = barrelNode.node
            })

            //  console.log({ position, updatePosition })
            return [map]
        }
        if (nextTile === WALL) {
            return [map, true]
        }
        if (nextTile === BARREL_START || nextTile === BARREL_END) {
            if (direction === LEFT || direction === RIGHT) {
                visitedBarrels.push({
                    pos: updatePosition,
                    node: nextTile,
                })
            }
        }
        updatePosition = [uusiY, uusiX]
    }
}
module.exports = main

const handleItFinally = (startNode, direction, map) => {
    const visited = new Set()
    const stack = [startNode]
    const approved = []
    while (stack.length > 0) {
        let node = stack.pop()
        if (visited.has(node.toString())) {
            continue
        } else {
            visited.add(node.toString())
        }
        const location = map[node[0]][node[1]]
        const modifierY = direction === UP ? node[0] - 1 : node[0] + 1
        const modifierX = node[1]

        if (location === WALL) {
            return false
        }
        if (location === FLOOR) {
            continue
        }
        approved.push({ pos: node, type: location })
        if (location === BARREL_START) {
            stack.push([node[0], node[1] + 1])
            stack.push([modifierY, modifierX])
        }
        if (location === BARREL_END) {
            stack.push([node[0], node[1] - 1])
            stack.push([modifierY, modifierX])
        }
    }
    return approved
}
