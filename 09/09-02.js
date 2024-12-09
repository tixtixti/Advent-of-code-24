const fs = require('node:fs').promises

async function main() {
    const input = await (await fs.readFile('input.txt', 'utf8')).split('')
    const withNodesAndSpaces = input
        .map((node, index) => {
            if (index % 2) {
                return '.'.repeat(node).split('')
            } else {
                let temp = []
                const id = Math.floor(index / 2).toString()
                for (let index = 0; index < node; index++) {
                    temp.push(id)
                }
                return temp
            }
        })
        .filter((node) => node[0])

    for (let index = withNodesAndSpaces.length - 1; index > 0; index--) {
        let nodeToInsert = withNodesAndSpaces[index]
        if (!nodeToInsert.includes('.')) {
            const firstFreeNode = withNodesAndSpaces.findIndex((node) => {
                if (node.includes('.') && node.length >= nodeToInsert.length) {
                    return node
                        .join('')
                        .includes(Array(nodeToInsert.length).fill('.').join(''))
                }
                return false
            })

            if (firstFreeNode !== -1) {
                let firstSlot = withNodesAndSpaces[firstFreeNode].indexOf('.')
                if (firstFreeNode < index) {
                    nodeToInsert.forEach((smallValue, index) => {
                        withNodesAndSpaces[firstFreeNode][firstSlot + index] =
                            smallValue
                    })
                    withNodesAndSpaces[index] = nodeToInsert.map((_) => '.')
                }
            }
        }
    }
    return withNodesAndSpaces.flat().reduce((prev, curr, index) => {
        return curr === '.' ? prev : prev + curr * index
    }, 0)
}

module.exports = main
