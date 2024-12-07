const fs = require('node:fs').promises

async function main() {
    const data = await fs.readFile('it.txt', 'utf8')
    const splitArray = data.split('\n').map((node) => node.split(': '))
    return splitArray.reduce((prev, task) => {
        const total = task[0]
        const parts = task[1].split(' ')
        if (findIt(parts, total)) {
            return prev + Number(total)
        }
        return prev
    }, 0)
}
main()

const findIt = (numbers, target) => {
    const helper = (index, currentValue) => {
        if (index === numbers.length) {
            return currentValue == target
        }
        const sum = helper(index + 1, currentValue + Number(numbers[index]))
        if (sum) return sum

        const mul = helper(index + 1, currentValue * Number(numbers[index]))
        if (mul) return mul

        const concat = helper(
            index + 1,
            Number(currentValue.toString().concat(numbers[index].toString()))
        )
        if (concat) return concat

        return null
    }
    return helper(1, Number(numbers[0]))
}

module.exports = main
