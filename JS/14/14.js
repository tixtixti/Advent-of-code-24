const fs = require('node:fs').promises

async function main(filename, big) {
    const array = (await fs.readFile(filename, 'utf8')).split('\n')
    //array.splice(2, array.length - 3)
    //console.log(array)
    const TICKS = 100
    const floorWidth = big ? 101 : 11
    const floorHeight = big ? 103 : 7
    const r2g = array.map((line) => {
        return line
            .match(/-?\d\d?\d?,-?\d\d?\d?/g)
            .map((node) => node.split(',').map(Number))
    })
    //console.log(r2g)
    const finalPos = r2g.map((line) => {
        const x = line[0][0]
        const y = line[0][1]
        const xv = line[1][0]
        const yv = line[1][1]
        return calculateFinalPositionMyWay(
            x,
            y,
            xv,
            yv,
            TICKS,
            floorWidth,
            floorHeight
        )
    })
    //console.log(finalPos)
    const result = robotsInQuadrants(finalPos, floorWidth, floorHeight)

    return result
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

    return {
        x: xFinal,
        y: yFinal,
    }
}

const robotsInQuadrants = (allPos, width, height) => {
    let q1Count = 0
    let q2Count = 0
    let q3Count = 0
    let q4Count = 0
    const lineWidth = Math.floor(width / 2)
    const lineHeigh = Math.floor(height / 2)

    allPos.forEach(({ x, y }) => {
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
