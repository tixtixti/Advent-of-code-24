const fs = require('node:fs').promises

async function main() {
    const data = await fs.readFile('input.txt', 'utf8')
    const dataArray = data.split('\n')

    return getValidUpdates(
        dataArray
            .filter((node) => !node.includes('|'))
            .filter((node) => node !== ''),
        createInstructionManual(dataArray.filter((node) => node.includes('|')))
    ).reduce(
        (prev, curr) => prev + Number(curr[Math.floor(curr.length / 2)]),
        0
    )
}

const createInstructionManual = (instructions) => {
    const manual = new Map()
    instructions.forEach((instructionString) => {
        const instructions = instructionString.split('|')
        !manual.get(instructions[1])
            ? manual.set(instructions[1], [instructions[0]])
            : manual.set(instructions[1], [
                  ...manual.get(instructions[1]),
                  instructions[0],
              ])
    })
    return manual
}

const getValidUpdates = (updates, instructionManual) => {
    const validUpdates = []
    updates.forEach((update) => {
        let isValid = true

        update.split(',').forEach((updateItem, itemIndex, allItems) => {
            allItems.slice(0, itemIndex).forEach((bfItem) => {
                if (!instructionManual.get(updateItem).includes(bfItem)) {
                    isValid = false
                }
            })
        })
        isValid ? validUpdates.push(update.split(',')) : null
    })
    return validUpdates
}

module.exports = main
