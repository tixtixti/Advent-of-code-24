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

    while (true) {
        let break2 = false
        let nodeToInsert = withNodesAndSpaces.pop()
        if (!nodeToInsert.includes('.')) {
            nodeToInsert.forEach((smallNode) => {
                const firstFreeNode = withNodesAndSpaces.findIndex((node) =>
                    node.includes('.')
                )
                if (firstFreeNode === -1) {
                    break2 = true
                    withNodesAndSpaces.push(smallNode)
                } else {
                    let firstSlot =
                        withNodesAndSpaces[firstFreeNode].indexOf('.')
                    withNodesAndSpaces[firstFreeNode][firstSlot] = smallNode
                }
            })
        }
        if (break2) {
            break
        }
    }

    return withNodesAndSpaces.flat().reduce((prev, curr, index) => {
        return prev + curr * index
    }, 0)
}

module.exports = main
