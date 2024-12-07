const fs = require('node:fs').promises

async function main() {
    const data = await fs.readFile('it.txt', 'utf8')
    const splitArray = data.split('\n').map((node) => node.split(': '))
    return splitArray.reduce((prev, task) => {
        const total = task[0]
        const parts = task[1].split(' ')
        if (findExpression(parts, total)) {
            return prev + Number(total)
        }
        return prev
    }, 0)
}

function findExpression(numbers, target) {
    function helper(index, expression, currentValue) {
        // Base case: If we reach the end of the numbers array
        if (index === numbers.length) {
            if (currentValue == target) {
                return expression // Valid expression found
            }
            return null // No match
        }

        // Try adding '+'
        const additionResult = helper(
            index + 1,
            `${expression} + ${numbers[index]}`,
            currentValue + parseInt(numbers[index])
        )
        if (additionResult) return additionResult

        // Try adding '*'
        const multiplicationResult = helper(
            index + 1,
            `${expression} * ${numbers[index]}`,
            currentValue * parseInt(numbers[index])
        )
        if (multiplicationResult) return multiplicationResult

        // No valid expression found
        return null
    }

    // Start recursion from the first number
    return helper(1, numbers[0], parseInt(numbers[0]))
}

module.exports = main
