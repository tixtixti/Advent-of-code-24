const fs = require('node:fs').promises

async function main(filename) {
    const array = (await fs.readFile(filename, 'utf8')).split('\n')
    let games = getValuesFromArray(array)

    console.log(games)
    const result = games.reduce((prev, game) => {
        const { k, n } = solveLinearEquations(game)
        if (Number.isInteger(k) && Number.isInteger(n)) {
            return prev + k * 3 + n
        }
        return prev
    }, 0)
    // Call the function and print the results

    return result
}

const getValuesFromArray = (array) => {
    let counter = 0
    let games = []
    array.forEach((line, index, self) => {
        if (counter === 0) {
            const aButton = line.match(/(\d)\w+/g)
            const bButton = self[index + 1].match(/(\d)\w+/g)
            const Prize = self[index + 2].match(/(\d)\w+/g)
            //console.log({ aButton, bButton, Prize })
            games.push({
                A: [Number(aButton[1]), Number(aButton[0])],
                B: [Number(bButton[1]), Number(bButton[0])],
                Prize: [
                    Number(Prize[1]) + 10000000000000,
                    Number(Prize[0]) + 10000000000000,
                ],
            })
            counter++
        } else if (line === '') {
            counter = 0
        } else {
            counter++
        }
    })
    return games
}
function solveLinearEquations(game) {
    // Coefficients for the equations
    const a1 = game.A[0],
        b1 = game.B[0],
        c1 = game.Prize[0]
    const a2 = game.A[1],
        b2 = game.B[1],
        c2 = game.Prize[1]
    // Elimination method
    // Multiply the equations to align coefficients of `k`
    const factor1 = a2 // Multiply first equation by 34
    const factor2 = a1 // Multiply second equation by 94

    const newB1 = b1 * factor1 // Scale b1
    const newB2 = b2 * factor2 // Scale b2
    const newC1 = c1 * factor1 // Scale c1
    const newC2 = c2 * factor2 // Scale c2

    // Eliminate `k` by subtracting the two equations
    const bFinal = newB2 - newB1 // Resulting coefficient of `n`
    const cFinal = newC2 - newC1 // Resulting constant term

    // Solve for `n`
    const n = cFinal / bFinal

    // Substitute `n` back into one of the original equations to solve for `k`
    const k = (c1 - b1 * n) / a1

    return { k, n }
}

module.exports = main
