const { parentPort, workerData } = require('worker_threads')

const checkIt = (manualArray, bfItem) => !manualArray.includes(bfItem)

const moveItem = (array, item, newIndex) => {
    const newArray = [...array]

    const currentIndex = newArray.indexOf(item)

    newArray.splice(currentIndex, 1)

    newArray.splice(newIndex, 0, item)

    return newArray
}

const iterativeMaybe = (invalidUpdate, instructionManual) => {
    const stack = [invalidUpdate]
    let counter = 0
    while (stack.length > 0) {
        counter++
        let stopCheck = false
        let toplelvArry = []
        const current = stack.pop()

        allupdatesLoop: for (
            let itemIndex = 0;
            itemIndex < current.length;
            itemIndex++
        ) {
            const item = current[itemIndex]

            const beforeItems = current.slice(0, itemIndex)

            if (beforeItems.length > 0) {
                for (let index = 0; index < beforeItems.length; index++) {
                    const element = beforeItems[index]
                    if (checkIt(instructionManual.get(item), element)) {
                        toplelvArry = moveItem(current, element, itemIndex)
                        stopCheck = true
                        break allupdatesLoop
                    }
                }
            } else {
                continue allupdatesLoop
            }
        }
        if (stopCheck) {
            stack.push(toplelvArry)
        } else {
            return current
        }
    }
}

function processPart(part, manual) {
    return part.map((element) => iterativeMaybe(element, manual))
}

const { part, manual } = workerData
const result = processPart(part, manual)
parentPort.postMessage(result)
