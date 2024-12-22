const fs = require('node:fs').promises

async function main() {
    const map = (await fs.readFile('./input.txt', 'utf8')).split('\n')
    let resultsMap = new Map()
    const res = map.reduce((prev, key) => {
        let tempRes = key
        let tempDigit = null
        let prevTempDigit = key % 10
        let last4Sequences = []
        const roundSet = new Set()
        for (let index = 0; index < 2000; index++) {
            tempRes = Math.abs(stepThree(stepTwo(stepOne(tempRes))))
            tempDigit = tempRes % 10 // last digit
            let currentSequence = tempDigit - prevTempDigit // diff
            last4Sequences.push(currentSequence) // save current to slot
            prevTempDigit = tempDigit // save current last digit to for next
            if (index > 3) {
                last4Sequences.shift()
                // once array is full
                let roundKey = last4Sequences.toString() // make key of array
                if (!roundSet.has(last4Sequences.toString())) {
                    //check if _roundSet_ has value
                    roundSet.add(roundKey) // add it there
                    if (!resultsMap.get(roundKey)) {
                        // while if _roundSet has _no_ value check if this is in results map
                        resultsMap.set(roundKey, tempDigit) // set if no, with last digits as value
                    } else {
                        // is not in roundSet but is in resultMap
                        resultsMap.set(
                            roundKey,
                            resultsMap.get(roundKey) + tempDigit
                        ) // update value with lastDigit
                    }
                } else {
                    // do nothing
                }
            }
        }
        return prev + tempRes
    }, 0)
    console.log(
        resultsMap.values().reduce((prev, curr) => {
            return Math.max(prev, curr)
        }, 0)
    )
}

const div = (x, y) => Math.floor(x / y)
const prune = (x) => Math.abs(x % 16777216)
const mix = (x, y) => (x ^ y) >>> 0
const mul = (x, y) => x * y

const stepOne = (x) => {
    return prune(mix(mul(x, 64), x))
}
const stepTwo = (x) => {
    return prune(mix(div(x, 32), x))
}
const stepThree = (x) => {
    return prune(mix(mul(x, 2048), x))
}
main()
