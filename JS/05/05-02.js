const fs = require('node:fs').promises
const { Worker } = require('worker_threads')
const path = require('path')

const handleAll = async (invalid, manual) => {
    const parts = splitArray(invalid, 24)
    const promises = parts.map((part) => runWorker(part, manual))
    const results = await Promise.all(promises)
    return results.flat()
}

function runWorker(part, manual) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.resolve(__dirname, './05-02-worker.js'),
            {
                workerData: { part, manual },
            }
        )

        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`))
            }
        })
    })
}

function splitArray(array, parts) {
    const size = Math.ceil(array.length / parts)
    return Array.from({ length: parts }, (_, i) =>
        array.slice(i * size, i * size + size)
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

const getInValidUpdates = (updates, instructionManual) => {
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
        !isValid ? validUpdates.push(update.split(',')) : null
    })
    return validUpdates
}
;(async function main() {
    const time = new Date()
    const data = await fs.readFile('input.txt', 'utf8')
    const dataArray = data.split('\n')
    const instructions = dataArray.filter((node) => node.includes('|'))
    const updates = dataArray
        .filter((node) => !node.includes('|'))
        .filter((node) => node !== '')

    const instructionManual = createInstructionManual(instructions)

    const invalidUpdates = getInValidUpdates(updates, instructionManual)

    const validones = await handleAll(invalidUpdates, instructionManual)

    const result = validones.reduce((prev, curr) => {
        return prev + Number(curr[Math.floor(curr.length / 2)])
    }, 0)

    console.log({ result, time: new Date() - time }) // input result 6456
    return result
})()
//module.exports = main
