const { readPosition } = require('./GraphLibrary.js')

const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
]
const directionsVisual = [
    '^', // up
    'v', // down
    '<', // left
    '>', // right
]

function bfsFindAllRoutes(graph, start, end) {
    const queue = [{ position: start, path: [start], steps: [] }]
    const allRoutes = []
    let currentMinRouteLength = 20000
    while (queue.length > 0) {
        //console.log(queue.length)
        const current = queue.shift()
        const [cy, cx] = current.position

        if (current.path.length > currentMinRouteLength) {
            continue
        }
        // If we've reached the end, store the path
        if (cy === end[0] && cx === end[1]) {
            // console.log('out')
            allRoutes.push(current.steps)
            currentMinRouteLength = Math.min(
                currentMinRouteLength,
                current.path.length
            )
            continue
        }

        // Explore neighbors
        directions.forEach(([dy, dx], index) => {
            const ny = cy + dy
            const nx = cx + dx
            const location = readPosition(graph, [ny, nx])

            if (location) {
                if (
                    current.path.some(
                        (node) => node.toString() === location.toString()
                    )
                ) {
                    console.log('been here')
                } else {
                    queue.push({
                        position: [ny, nx],
                        path: [...current.path, [ny, nx]],
                        steps: [...current.steps, directionsVisual[index]],
                    })
                }

                //console.log({ location })
            }
        })
    }
    return allRoutes
}

module.exports.bfsFindAllRoutes = bfsFindAllRoutes
