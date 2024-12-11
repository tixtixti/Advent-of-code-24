async function main(input, blinkNumber = 25) {
    const array = input.split(' ').map(Number)
    const precomputedResults = new Map()

    let result = 0
    const stack = []

    // Initialize the stack
    array.forEach((node) => {
        stack.push({ item: node, remainingBlinks: blinkNumber })
    })

    while (stack.length > 0) {
        const process = stack.shift()
        const key = `${process.item}_${process.remainingBlinks}`

        if (precomputedResults.has(key)) {
            // Add precomputed result
            result += precomputedResults.get(key)
        } else {
            // Compute result on-demand and cache it
            const computed = computeResult(
                process.item,
                process.remainingBlinks,
                precomputedResults
            )
            result += computed
        }
    }

    return result
}

// Recursive function to compute results
function computeResult(node, remainingBlinks, precomputedResults) {
    if (remainingBlinks === 0) {
        return 1 // Base case: 1 result for fully processed nodes
    }

    const key = `${node}_${remainingBlinks}`
    if (precomputedResults.has(key)) {
        return precomputedResults.get(key) // Return cached result
    }

    // Compute result recursively
    const handledBlink = handleBlink(node)
    let result = 0
    handledBlink.forEach((child) => {
        result += computeResult(child, remainingBlinks - 1, precomputedResults)
    })

    // Cache the result
    precomputedResults.set(key, result)
    return result
}

// Blink handling logic
const handleBlink = (node) => {
    if (node === 0) {
        return [1]
    }

    const str = node.toString()
    if (str.length % 2 === 0) {
        const midpoint = str.length / 2
        const firstHalf = Number(str.slice(0, midpoint))
        const secondHalf = Number(str.slice(midpoint))
        return [firstHalf, secondHalf]
    }

    return [node * 2024]
}
module.exports = main
