const fs = require('node:fs').promises

async function main() {
    const array = (await fs.readFile('input.txt', 'utf8')).split('\n')
    //array.splice(2, array.length - 3)
    //console.log(array)
    let ticks = 0
    const floorWidth = 101
    const floorHeight = 103
    const r2g = array.map((line) => {
        return line
            .match(/-?\d\d?\d?,-?\d\d?\d?/g)
            .map((node) => node.split(',').map(Number))
    })
    while (ticks < 10000000) {
        let nextPos = r2g.map((line) => {
            const x = line[0][0]
            const y = line[0][1]
            const xv = line[1][0]
            const yv = line[1][1]
            return calculateFinalPositionMyWay(
                x,
                y,
                xv,
                yv,
                ticks,
                floorWidth,
                floorHeight
            )
        })

        const result = robotsInQuadrants(nextPos, floorWidth, floorHeight)
        // const ab = robotsInQuadrants(nextPos, floorWidth, floorHeight)
        //console.log(ab)
        if (result < 100356790) {
            drawIt(floorHeight, floorWidth, nextPos, ticks)
            return 0
        }

        ticks++
    }
    return 0
}
module.exports = main

function calculateFinalPositionMyWay(x, y, xv, yv, ticks, width, height) {
    // Calculate total displacement
    const xTotal = x + xv * ticks
    const yTotal = y + yv * ticks

    // Calculate wraps
    const wrapsX = Math.floor(xTotal / width)
    const wrapsY = Math.floor(yTotal / height)

    // Calculate final position
    let xFinal = xTotal - wrapsX * width
    let yFinal = yTotal - wrapsY * height

    // Ensure final position is non-negative (handles negative velocities)
    if (xFinal < 0) xFinal += width
    if (yFinal < 0) yFinal += height

    return [
        [xFinal, yFinal],
        [xv, yv],
    ]
}

const drawIt = (height, width, currentPos, tick) => {
    const emptyArray = [...Array(height)].map((_row) => [
        ...Array(width).fill('_'),
    ])
    currentPos.forEach((node, index) => {
        const y = node[0][1]
        const x = node[0][0]
        let row = emptyArray[y]
        row[x] = '*'
    })

    const drawable = emptyArray.map((line) => line.join('')).join('\n')

    console.log(drawable, tick)
    console.log('\n')
}

const robotsInQuadrants = (allPos, width, height) => {
    let q1Count = 0
    let q2Count = 0
    let q3Count = 0
    let q4Count = 0
    const lineWidth = Math.floor(width / 2)
    const lineHeigh = Math.floor(height / 2)

    allPos.forEach((node) => {
        const [x, y] = node[0]
        //console.log({ x, y })
        if (x < lineWidth && y < lineHeigh) {
            q1Count++
        } else if (x > lineWidth && y < lineHeigh) {
            q2Count++
        } else if (x < lineWidth && y > lineHeigh) {
            q3Count++
        } else if (x > lineWidth && y > lineHeigh) {
            q4Count++
        } else {
            // console.log({ x, y })
        }
    })
    //console.log({ q1Count, q2Count, q3Count, q4Count })
    return q1Count * q2Count * q3Count * q4Count
}
main()

/*
0 1
1 3
2 5
3 7
4 9

*/
