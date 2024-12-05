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

    const invalidUpdates = getValidUpdates(updates, instructionManual, false)

    const validones = await handleAll(invalidUpdates, instructionManual)

    //  console.log(validones)

    const result = validones.reduce((prev, curr) => {
        return prev + Number(curr[Math.floor(curr.length / 2)])
    }, 0)

    console.log({ result }) // input result 6456
    //   return result
}
main()

const handleAll = async (invalid, manual) => {
    let validOnes = []
    for (let index = 0; index < invalid.length; index++) {
        const element = invalid[index]

        await new Promise((resolve) => setImmediate(resolve))
        validOnes.push(await recursivemaybe(element, manual))
    }
    return validOnes
}
const recursivemaybe = async (invalidUpdate, instructionManual) => {
    let stopCheck = false
    let toplelvArry = []

    allupdatesLoop: for (
        let itemIndex = 0;
        itemIndex < invalidUpdate.length;
        itemIndex++
    ) {
        const item = invalidUpdate[itemIndex]

        const { beforeItems } = splitArrayByIndex(invalidUpdate, itemIndex)

        if (beforeItems.length > 0) {
            for (let index = 0; index < beforeItems.length; index++) {
                const element = beforeItems[index]
                if (checkIt(instructionManual[item].previous, element)) {
                    toplelvArry = moveItem(invalidUpdate, element, itemIndex)
                    stopCheck = true
                    break allupdatesLoop
                }
            }
        } else {
            continue allupdatesLoop
        }
    }
    if (stopCheck) {
        //  console.log('looping')
        await new Promise((resolve) => setImmediate(resolve))
        return recursivemaybe(toplelvArry, instructionManual)
    } else {
        return invalidUpdate
    }
}

const checkIt = (manualArray, bfItem) => !manualArray.includes(bfItem)

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

const moveItem = (array, item, newIndex) => {
    // Clone the array to avoid mutating the original
    const newArray = [...array]

    // Find the index of the item
    const currentIndex = newArray.indexOf(item)

    if (currentIndex === -1) {
        throw new Error('Item not found in the array.')
    }

    // Remove the item from the current position
    newArray.splice(currentIndex, 1)

    // Insert the item at the new position
    newArray.splice(newIndex, 0, item)

    return newArray
}

const getValidUpdates = (updates, instructionManual, valid = true) => {
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
                }
            })
            afterItems.forEach((afItem) => {
                if (!instructionManual[updateItem].next.includes(afItem)) {
                    hasAlreadyError = true
                    // console.log({ updateItem, update, type: 'after', afItem })
                }
            })
        })
        if ((valid && !hasAlreadyError) || (!valid && hasAlreadyError)) {
            validUpdates.push(update.split(','))
        }
    })
    return validUpdates
}
