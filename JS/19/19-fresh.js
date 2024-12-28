const fs = require('node:fs').promises

//const FILENAME = 'test.txt'
const FILENAME = 'input.txt'
//const FILENAME = 'smallInput.txt'

async function main() {
    const input = await fs.readFile(FILENAME, 'utf8')
    const lines = input.split('\n')
    const towels = lines
        .splice(0, 2)[0]
        .split(',')
        .flat()
        .map((node) => node.trim())
    let towelSet = new Set()
    towels.forEach((node) => towelSet.add(node))
    towels.sort((a, b) => b.length - a.length)

    const maxLength = towels[0].length
    const res = lines.reduce((prev, line) => {
        return prev + countAllVariations(line, towelSet, maxLength)
    }, 0)
    console.log(res)
    return 0
}

function countAllVariations(line, towelSet, maxLength) {
    const lineLength = line.length
    const dp = Array(lineLength + 1).fill(0) // DP array to store the number of ways
    dp[0] = 1 // Base case: 1 way to construct an empty string

    for (let i = 1; i <= lineLength; i++) {
        for (let j = Math.max(0, i - maxLength); j < i; j++) {
            const substring = line.slice(j, i) // Substring from j to i
            if (towelSet.has(substring)) {
                dp[i] = dp[i] + dp[j]
            }
        }
    }

    return dp[lineLength] // Total number of ways to construct the full string
}

main()
