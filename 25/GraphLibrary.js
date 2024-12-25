module.exports.findAllOccurances = (array2d, entity) => {
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

module.exports.findStartingPoint = (allInOne, symbol = '@') => {
    const startingCoords = []
    allInOne.forEach((node, index) => {
        if (node.includes(symbol)) {
            startingCoords.push([index, node.indexOf(symbol)])
        }
    })
    return startingCoords
}
module.exports.readPosition = (map, node) =>
    map[node[0]] && map[node[0]][node[1]]

module.exports.printMap = (map) => {
    let printMap = [...map]
    console.log('////')
    console.log(printMap.map((line) => line.join('')).join('\n'))
}
module.exports.inputPosition = (grid, [y, x], value) => (grid[y][x] = value)
