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
    while (ticks < 100) {
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
        //console.log(nextPos)
        await new Promise((r) => setTimeout(r, 500))
        drawIt(floorHeight, floorWidth, nextPos, ticks)
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
    const emptyArray = [...Array(height)].map((row) => [
        ...Array(width).fill('_'),
    ])

    // const drawable = emptyArray.map((line) => line.join('')).join('\n')
    // console.log(drawable)
    let drawItRe = false
    // console.log(currentPos.length)
    let setti = new Set()
    // console.log(setti)
    currentPos.forEach((node, index) => {
        const y = node[0][1]
        const x = node[0][0]
        //console.log(emptyArray[y][x], x, y)
        let row = emptyArray[y]
        row[x] = '*'
        //console.log(row)
    })

    const drawable = emptyArray.map((line) => line.join('')).join('\n')

    //const drawable = emptyArray[y].join('')
    console.log(drawable, tick)
    console.log('\n')
    //console.log(drawable)

    /*
    // console.log(emptyArray[0])
    let numberRequired = 1
    if (
        emptyArray[0].filter((node) => node === '*').length === numberRequired
    ) {
        console.log(emptyArray)
    }
        */
}
main()

/*
0 1
1 3
2 5
3 7
4 9

*/
