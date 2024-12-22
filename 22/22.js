const results = {
    1: 8685429,
    10: 4700978,
    100: 15273692,
    2024: 8667524,
}
const fs = require('node:fs').promises

async function main() {
    const map = (await fs.readFile('./input.txt', 'utf8')).split('\n')
    const res = map.reduce((prev, key) => {
        let tempRes = key

        for (let index = 0; index < 2000; index++) {
            tempRes = Math.abs(stepThree(stepTwo(stepOne(tempRes))))
        }
        return prev + tempRes
    }, 0)

    console.log(res)
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
