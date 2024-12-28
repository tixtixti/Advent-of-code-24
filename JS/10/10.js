const fs = require('node:fs').promises

async function main(part) {
    const array2d = (await fs.readFile('input.txt', 'utf8'))
        .split('\n')
        .map((node) => node.split(''))

    const starts = findStartingPositions(array2d)
    const total = starts.reduce((prev, curr) => {
        const routes = findPath(array2d, curr, part)
        return routes ? prev + routes.length : prev
    }, 0)

    return total
}

const findStartingPositions = (array2d) => {
    let positions = []
    array2d.forEach((row, Yindex) => {
        row.forEach((node, Xindex) => {
            if (node == 0) {
                positions.push([Yindex, Xindex])
            }
        })
    })
    return positions
}

const findPath = (array2d, startPos, part) => {
    const startStack = {
        startPos,
        pathTaken: [startPos],
        nextNumber: 1,
    }
    const stack = [startStack]
    let paths = []
    let reachableNines = new Set()
    while (stack.length > 0) {
        const currentStack = stack.pop()
        const latestNode = [...currentStack.pathTaken].pop()
        const currentY = latestNode[0]
        const currentX = latestNode[1]
        const currentNext = currentStack.nextNumber

        if (array2d[currentY][currentX] == 9) {
            paths.push(currentStack.pathTaken)
            reachableNines.add([currentY, currentX].toString())
            continue
        }

        // YLÖS
        if (
            array2d[currentY + 1] &&
            array2d[currentY + 1][currentX] == currentNext
        ) {
            stack.push(
                buildNewStackItem(currentY + 1, currentX, { ...currentStack })
            )
        }
        // ALAS
        if (
            array2d[currentY - 1] &&
            array2d[currentY - 1][currentX] == currentNext
        ) {
            stack.push(
                buildNewStackItem(currentY - 1, currentX, { ...currentStack })
            )
        }
        // OIKEALLE
        if (array2d[currentY][currentX + 1] == currentNext) {
            stack.push(
                buildNewStackItem(currentY, currentX + 1, { ...currentStack })
            )
        } // VASEMALLE
        if (array2d[currentY][currentX - 1] == currentNext) {
            stack.push(
                buildNewStackItem(currentY, currentX - 1, { ...currentStack })
            )
        }
    }
    return part === 1 ? Array.from(reachableNines) : paths
}

const buildNewStackItem = (newCoordY, newCoordX, currentStack) => {
    return {
        ...currentStack,
        pathTaken: [...currentStack.pathTaken, [newCoordY, newCoordX]],
        nextNumber: currentStack.nextNumber + 1,
    }
}

module.exports = main
