const fs = require('node:fs').promises

async function main(filename) {
    const array2d = (await fs.readFile(filename, 'utf8'))
        .split('\n')
        .map((node) => node.split(''))

    const uniques = Array.from(findAllUniquePlants(array2d))
    const allOccurances = uniques.map((node) =>
        findAllOccurances(array2d, node)
    ) // same order

    const allIsles = allOccurances.map((occurance) => {
        return findAllIsles(occurance)
    })
    /*
    const result = allIsles.flat().reduce((prev, curr) => {
        const perimeterCount = calculatePerimiter(curr)
        const area = curr.length
        const thisScore = perimeterCount * area
        return prev + thisScore
    }, 0)
*/

    const result = allIsles.flat().reduce((prev, curr) => {
        const sideCount = calculateSides(curr)
        const area = curr.length
        const thisScore = sideCount * area
        return prev + thisScore
    }, 0)

    return result
}

const findAllUniquePlants = (array2d) => {
    let uniques = new Set()
    array2d.forEach((row) => {
        row.forEach((node) => {
            uniques.add(node)
        })
    })
    return uniques
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
const findAllIsles = (allOccurancesOfSingePlant) => {
    const visited = new Set()
    let isles = []
    const nodeSet = new Set(
        allOccurancesOfSingePlant.map((node) => node.toString())
    )
    allOccurancesOfSingePlant.forEach((node) => {
        const key = node.toString()
        if (!visited.has(key)) {
            const component = []
            dfs(node, component, visited, nodeSet)
            isles.push(component)
        }
    })

    return isles
}

const getNeighbors = (node, nodeSet) => {
    const [x, y] = node
    const potentialNeighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ]
    return potentialNeighbors.filter((neighbor) =>
        nodeSet.has(neighbor.toString())
    )
}

const dfs = (node, component, visited, nodeSet) => {
    const key = node.toString()
    if (visited.has(key)) return

    visited.add(key)
    component.push(node)

    const neighbors = getNeighbors(node, nodeSet)
    for (const neighbor of neighbors) {
        dfs(neighbor, component, visited, nodeSet)
    }
}

const calculatePerimiter = (isle) => {
    const nodeSet = new Set(isle.map((node) => node.toString()))
    let perimeterCount = 0
    isle.forEach((node) => {
        const [x, y] = node
        const potentialNeighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ]
        potentialNeighbors.forEach((potNei) => {
            if (!nodeSet.has(potNei.toString())) {
                perimeterCount++
            }
        })
    })
    return perimeterCount
}

const calculateSides = (isle) => {
    const nodeSet = new Set(isle.map((node) => node.toString()))

    let fences = new Set()
    isle.forEach((node) => {
        const [x, y] = node
        const potentialNeighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ]
        potentialNeighbors.forEach((potNei) => {
            findFences(potNei, fences, nodeSet, node)
        })
    })

    const arrayFences = Array.from(fences)
    const tops = filterDirection(arrayFences, 'top').sort((a, b) => a[1] - b[1])
    const bottoms = filterDirection(arrayFences, 'bottom').sort(
        (a, b) => a[1] - b[1]
    )
    const lefts = filterDirection(arrayFences, 'left').sort(
        (a, b) => a[0] - b[0]
    )
    const rights = filterDirection(arrayFences, 'right').sort(
        (a, b) => a[0] - b[0]
    )

    let topCount = handleFenceCoords2(tops)
    let bottomCount = handleFenceCoords2(bottoms)
    let rightCount = handleFenceCoords2(rights, true)
    let leftCount = handleFenceCoords2(lefts, true)

    return leftCount + rightCount + topCount + bottomCount
}

const helpFnForMapping = (top) => {
    const coordStr = top.split('/')[1]
    return coordStr.split(',').map(Number)
}

module.exports = main

const findFences = (potNei, fences, nodeSet, node) => {
    if (!nodeSet.has(potNei.toString())) {
        if (node[0] - potNei[0] > 0) {
            fences.add('top/' + potNei.toString())
        }
        if (node[0] - potNei[0] < 0) {
            fences.add('bottom/' + potNei.toString())
        }
        if (node[1] - potNei[1] > 0) {
            fences.add('left/' + potNei.toString())
        }
        if (node[1] - potNei[1] < 0) {
            fences.add('right/' + potNei.toString())
        }
    }
}

const filterDirection = (arrayFences, direction) =>
    arrayFences.filter((node) => node.includes(direction)).map(helpFnForMapping)

const handleFenceCoords2 = (fenceDirectionArray, leftOrRight) => {
    let count = 0
    let visitedCoords = new Set()
    let visitedAnotherCoord = new Map()
    fenceDirectionArray.forEach((fence) => {
        const meaningfulCoord = leftOrRight ? fence[1] : fence[0]
        const anotherCoord = leftOrRight ? fence[0] : fence[1]
        let alreadyVisitedAnother = visitedAnotherCoord.get(meaningfulCoord)
        if (!visitedCoords.has(meaningfulCoord)) {
            count++
            visitedCoords.add(meaningfulCoord)
            visitedAnotherCoord.set(meaningfulCoord, [anotherCoord])
        } else if (
            alreadyVisitedAnother.some(
                (element) => Math.abs(element - anotherCoord) === 1
            )
        ) {
            visitedAnotherCoord.set(meaningfulCoord, [
                ...alreadyVisitedAnother,
                anotherCoord,
            ])
        } else {
            count++
            visitedAnotherCoord.set(meaningfulCoord, [
                ...alreadyVisitedAnother,
                anotherCoord,
            ])
        }
    })
    return count
}
