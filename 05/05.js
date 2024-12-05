const fs = require('node:fs').promises

async function main() {
    const data = await fs.readFile('input.txt', 'utf8')
    const dataArray = data.split('\n')
    const instructions = dataArray.filter((node) => node.includes('|'))
    const updates = dataArray
        .filter((node) => !node.includes('|'))
        .filter((node) => node !== '')

    const instructionManual = createInstructionManueal(instructions)
    // console.log(instructionManual)

    const validUpdates = getValidUpdates(updates, instructionManual)

    const result = validUpdates.reduce((prev, curr) => {
        return prev + Number(curr[Math.floor(curr.length / 2)])
    }, 0)
    console.log({ result }) // input result 4569
    return result
}
main()

const createInstructionManueal = (instructions) => {
    let instructionManual = {}
    // X | Y , X:n täytyy tulla ennne Y:tä, Y:tä täytyy edeltää X
    instructions.forEach((instructionString) => {
        instructionString.split('|').forEach((node, index, self) => {
            if (!instructionManual[node]) {
                if (index === 0) {
                    instructionManual = {
                        ...instructionManual,
                        ...createNewNodeForManual(node, self[1]),
                    }
                } else {
                    instructionManual = {
                        ...instructionManual,
                        ...createNewNodeForManualForSecondEntry(node, self[0]),
                    }
                }
            } else {
                if (index === 0) {
                    instructionManual[node].next.push(self[1])
                } else {
                    instructionManual[node].previous.push(self[0])
                }
            }
        })
    })
    return instructionManual
}

const createNewNodeForManual = (first, second) => ({
    [first]: {
        previous: [],
        next: [second],
    },
})

const createNewNodeForManualForSecondEntry = (first, second) => ({
    [first]: {
        previous: [second],
        next: [],
    },
})

const splitArrayByIndex = (array, currentIndex) => {
    // Ensure the index is within bounds
    if (currentIndex < 0 || currentIndex >= array.length) {
        throw new Error('Index is out of bounds.')
    }

    // Split the array
    const beforeItems = array.slice(0, currentIndex) // Items before the index
    const afterItems = array.slice(currentIndex + 1) // Items after the index

    return { beforeItems, afterItems }
}

const getValidUpdates = (updates, instructionManual) => {
    const validUpdates = []
    updates.forEach((update) => {
        let hasAlreadyError = false

        update.split(',').forEach((updateItem, itemIndex, allItems) => {
            const { beforeItems, afterItems } = splitArrayByIndex(
                allItems,
                itemIndex
            )

            beforeItems.forEach((bfItem) => {
                if (!instructionManual[updateItem].previous.includes(bfItem)) {
                    hasAlreadyError = true
                }
            })
            afterItems.forEach((afItem) => {
                if (!instructionManual[updateItem].next.includes(afItem)) {
                    hasAlreadyError = true
                }
            })
        })
        if (!hasAlreadyError) {
            validUpdates.push(update.split(','))
        }
    })
    return validUpdates
}
