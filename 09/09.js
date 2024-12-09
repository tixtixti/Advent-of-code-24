const fs = require('node:fs').promises

async function main() {
    const input = await (await fs.readFile('input.txt', 'utf8')).split('')
    let indexe = 0
    const ogOrder = input.map((node, index) => {
        if (index % 2) {
            return '.'.repeat(node)
        } else {
            const abba = indexe.toString().repeat(node)
            indexe++
            return abba
        }
    })
    let copy = [...ogOrder.join('')]
    console.log([...copy].reverse().splice(0, 100).join(''))
    console.log([...copy].splice(0, 100).join(''))
    let index = 0
    let endIndex = 9999 // kokeile haskata ne niiku alkioina eikä numeroina.
    while (true) {
        const firstFreeSpace = copy.indexOf('.')

        if (firstFreeSpace === -1) {
            break
        }
        let node = copy.pop()
        if (node !== '.') {
            copy[firstFreeSpace] = node
            if (index < 30) {
                console.log([...copy].splice(0, 100).join(''))
            }
            index++
        }
    }
    //console.log(copy.join(''))

    console.log(copy.length, input.length)
    const abba = copy.reduce((prev, curr, index) => {
        if (curr === '.') {
            console.log('KURRE')
        }
        return prev + curr * index
    }, 0)

    console.log(copy.reverse().splice(0, 100).join(''))
    console.log(abba)
    return abba
}

main()
module.exports = main
