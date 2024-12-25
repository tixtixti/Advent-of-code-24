const fs = require('node:fs').promises
const { printMap } = require('./GraphLibrary.js')

async function main() {
    const input = (await fs.readFile('./input.txt', 'utf8'))
        .split('\n')
        .map((line) => line.split(''))

    const { keyCollectionPins, lockCollectionPins } = readKeysAndLocks(input)
    console.log(keyCollectionPins)
    console.log(lockCollectionPins)
    let counter = 0
    lockCollectionPins.forEach((lock, lIndex) => {
        console.log(lIndex)
        let fits = true
        keyCollectionPins.forEach((key) => {
            key.forEach((keyPin, index) => {
                if (fits) {
                    fits = keyPin + lock[index] < 6
                }
            })
            if (fits) {
                counter++
            }
            fits = true
        })
    })
    console.log(counter)
}
main()

const readSchematicNumbers = (schematic, isLock) => {
    let pinMap = new Map()
    if (isLock) {
        schematic.shift()
    } else {
        schematic.pop()
    }
    printMap(schematic)
    schematic.forEach((row) => {
        row.forEach((node, index) => {
            if (!pinMap.get(index)) {
                pinMap.set(index, 0)
            }
            if (node === '#') {
                pinMap.set(index, pinMap.get(index) + 1)
            }
        })
    })
    return Array.from(pinMap.values())
}

const readKeysAndLocks = (input) => {
    const keyCollections = []
    const lockCollection = []

    while (input.length > 0) {
        const nextSchematic = input.splice(0, 7)
        input.shift() // remove empty
        const isLock = nextSchematic[0].every((node) => node === '#')
        if (isLock) {
            lockCollection.push(nextSchematic)
        } else {
            keyCollections.push(nextSchematic)
        }
    }
    const keyCollectionPins = keyCollections.map((node) =>
        readSchematicNumbers(node, false)
    )
    const lockCollectionPins = lockCollection.map((node) =>
        readSchematicNumbers(node, true)
    )
    return { keyCollectionPins, lockCollectionPins }
}
