const fs = require('node:fs').promises

async function main() {
    const array2d = (await fs.readFile('input.txt', 'utf8'))
        .split('\n')
        .map((node) => node.split(''))
    const allAntennas = new Set()
    array2d.forEach((row) =>
        row.forEach((node) => (node !== '.' ? allAntennas.add(node) : null))
    )
    const abba = Array.from(allAntennas).map((node) => {
        return findAntennaLocation(array2d, findAntennasPerType(array2d, node))
    }, 0)

    return countUniques(abba.flat())
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
    ZeroAntennas.forEach((node, index, self) => {
        if (index < self.length - 1) {
            for (let indexInner = 1; indexInner < self.length; indexInner++) {
                const element = self[index + indexInner]
                if (element) {
                    const diffY = node[0] - element[0]
                    const diffX = node[1] - element[1]
                    let antiNodeLocation = [node[0] + diffY, node[1] + diffX]
                    let anotherAntiNodeLocation = [
                        element[0] - diffY,
                        element[1] - diffX,
                    ]

                    if (checkIfInsideMatrix(antiNodeLocation, matrix)) {
                        locations.push(antiNodeLocation)
                    }
                    if (checkIfInsideMatrix(anotherAntiNodeLocation, matrix)) {
                        locations.push(anotherAntiNodeLocation)
                    }
                }
            }
        }
    })
    return locations
}

const checkIfInsideMatrix = (antiNodeLocation, matrix) => {
    const yCoord = antiNodeLocation[0]
    const xCoord = antiNodeLocation[1]
    try {
        return matrix[yCoord][xCoord]
    } catch (e) {
        return false
    }
}
const countUniques = (array) => {
    let abba = new Set()
    array.forEach((node) => abba.add(node.toString()))
    return abba.size
}
module.exports = main

/**
 * 
[
  [ 0, 11 ],  [ 3, 2 ],
  [ 7, 0 ],   [ 1, 3 ],
  [ 4, 9 ],   [ 0, 6 ],
  [ 6, 3 ],   [ 2, 10 ],
  [ 5, 1 ],   [ 2, 4 ],
  [ 11, 10 ], [ 1, 3 ],
  [ 7, 7 ],   [ 10, 10 ]
]





......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.
 */
