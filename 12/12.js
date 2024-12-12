const fs = require('node:fs').promises

async function main(sides = false) {
    const array2d = (await fs.readFile('it.txt', 'utf8'))
        .split('\n')
        .map((node) => node.split(''))

    const uniques = Array.from(findAllUniquePlants(array2d))
    const allOccurances = uniques.map((node) =>
        findAllOccurances(array2d, node)
    ) // same order

    const allIsles = allOccurances.map((occurance) => {
        return findAllIsles(occurance)
    })

    const result = allIsles.flat().reduce((prev, curr) => {
        const perimeterCount = calculatePerimiter(curr)
        const area = curr.length
        const thisScore = perimeterCount * area
        return prev + thisScore
    }, 0)

    console.log(calculateSides(allIsles[2][0]))
    /*
    const result = allIsles.flat().reduce((prev, curr) => {
        const sideCount = calculateSides(curr)
        console.log(sideCount)
        const area = curr.length
        const thisScore = sideCount * area
        return prev + thisScore
    }, 0)
*/
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
    let sideCount = 0
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
            if (!nodeSet.has(potNei.toString())) {
                sideCount++
                if (node[0] - potNei[0] > 0) {
                    fences.add('top/' + potNei.toString())
                }
                if (node[0] - potNei[0] < 0) {
                    fences.add('bottom/' + potNei.toString())
                }
                if (node[1] - potNei[1] > 0) {
                    fences.add('left/' + potNei.toString())
                }
                if (node[1] - potNei[1] > 0) {
                    fences.add('right/' + potNei.toString())
                }
            }
        })
    })
    const arrayFences = Array.from(fences)

    const tops = arrayFences
        .filter((node) => node.includes('top'))
        .map(helpFnForMapping)
    const bottoms = arrayFences
        .filter((node) => node.includes('bottom'))
        .map(helpFnForMapping)
    const lefts = arrayFences
        .filter((node) => node.includes('left'))
        .map(helpFnForMapping)
    const rights = arrayFences
        .filter((node) => node.includes('right'))
        .map(helpFnForMapping)

    let topSides = 0
    const topCoordSet = new Set(tops.map((node) => node.toString()))
    const bottomCoordSet = new Set(bottoms.map((node) => node.toString()))
    const rightCoordSet = new Set(rights.map((node) => node.toString()))
    const leftCoordSet = new Set(lefts.map((node) => node.toString()))
    let topCount = 0
    tops.forEach((topCoord) => {
        const topCoordLeft = `${topCoord[0]},${topCoord[1] + 1}`
        const topCoordRight = `${topCoord[0]},${topCoord[1] - 1}`
        if (topCoordSet.has(topCoordLeft) || topCoordSet.has(topCoordRight)) {
            // nothing
        } else {
            topCount++
            topSides++
        }
    })
    let bottomCount = 0
    bottoms.forEach((topCoord) => {
        console.log({ bottoms, bottomCoordSet })
        const topCoordLeft = `${topCoord[0]},${topCoord[1] + 1}`
        const topCoordRight = `${topCoord[0]},${topCoord[1] - 1}`
        if (
            bottomCoordSet.has(topCoordLeft) ||
            bottomCoordSet.has(topCoordRight)
        ) {
            // nothing
        } else {
            bottomCount++
            topSides++
        }
    })
    let rightCount = 0

    rights.forEach((topCoord) => {
        const topCoordLeft = `${topCoord[0 + 1]},${topCoord[1]}`
        const topCoordRight = `${topCoord[0] - 1},${topCoord[1]}`
        if (
            rightCoordSet.has(topCoordLeft) ||
            rightCoordSet.has(topCoordRight)
        ) {
            // nothing
        } else {
            rightCount++
            topSides++
        }
    })
    let leftCount = 0
    const visitedLeft = new Set()
    console.log({ lefts })
    lefts.forEach((topCoord) => {
        const topCoordLeft = `${topCoord[0] - 1},${topCoord[1]}`
        const topCoordRight = `${topCoord[0] + 1},${topCoord[1]}`
        console.log({ topCoord, topCoordLeft, topCoordRight })
        if (leftCoordSet.has(topCoordLeft) || leftCoordSet.has(topCoordRight)) {
            if (!visitedLeft.has(topCoord.toString())) {
                console.log(visitedLeft, topCoord)
                leftCount++
                visitedLeft.add(topCoord.toString())
                visitedLeft.add(topCoordLeft)
                visitedLeft.add(topCoordRight)
            }
            // nothing
        } else {
            leftCount++
            topSides++
        }
    })

    console.log({ leftCount, topCount, bottomCount, rightCount })
    return (
        Math.max(leftCount, 1) +
        Math.max(rightCount, 1) +
        Math.max(topCount, 1) +
        Math.max(bottomCount, 1)
    )
}

const helpFnForMapping = (top) => {
    const coordStr = top.split('/')[1]
    return coordStr.split(',').map(Number)
}

module.exports = main
