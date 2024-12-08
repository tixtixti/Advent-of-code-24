const fs = require('node:fs').promises

async function main() {
    const array2d = (await fs.readFile('input.txt', 'utf8'))
        .split('\n')
        .map((node) => node.split(''))
    const allAntennas = new Set()
    array2d.forEach((row) =>
        row.forEach((node) => (node !== '.' ? allAntennas.add(node) : null))
    )
    return countUniques(
        Array.from(allAntennas, (node) =>
            findAntennaLocation(array2d, findAntennasPerType(array2d, node))
        ).flat()
    )
}

const findAntennasPerType = (matrix, antennaType) => {
    let nodes = []
    matrix.forEach((row, indexY) => {
        row.forEach((node, indexX) => {
            if (node === antennaType) {
                nodes.push([indexY, indexX])
            }
        })
    })
    return nodes
}

const findAntennaLocation = (matrix, ZeroAntennas) => {
    let locations = []
    if (ZeroAntennas.length > 1) {
        ZeroAntennas.forEach((node, index, self) => {
            if (index < self.length - 1) {
                for (
                    let indexInner = 1;
                    indexInner < self.length;
                    indexInner++
                ) {
                    const element = self[index + indexInner]
                    if (element) {
                        const diffY = node[0] - element[0]
                        const diffX = node[1] - element[1]
                        let multiplier = 1
                        while (true) {
                            let antiNodeLocation = [
                                node[0] + diffY * multiplier,
                                node[1] + diffX * multiplier,
                            ]
                            let anotherAntiNodeLocation = [
                                element[0] - diffY * multiplier,
                                element[1] - diffX * multiplier,
                            ]
                            const firstIsInside = checkIfInsideMatrix(
                                antiNodeLocation,
                                matrix
                            )
                            const secondIsInside = checkIfInsideMatrix(
                                anotherAntiNodeLocation,
                                matrix
                            )
                            if (firstIsInside) {
                                locations.push(antiNodeLocation)
                            }
                            if (secondIsInside) {
                                locations.push(anotherAntiNodeLocation)
                            }
                            if (!firstIsInside && !secondIsInside) {
                                break
                            }
                            multiplier++
                        }
                    }
                }
            }
        })
        return [...locations, ...ZeroAntennas]
    }
    return locations
}

const checkIfInsideMatrix = (antiNodeLocation, matrix) => {
    const yCoord = antiNodeLocation[0]
    const xCoord = antiNodeLocation[1]
    try {
        return !!matrix[yCoord][xCoord]
    } catch (e) {
        return false
    }
}
const countUniques = (array) => {
    let count = new Set()
    array.forEach((node) => count.add(node.toString()))
    return count.size
}
module.exports = main
