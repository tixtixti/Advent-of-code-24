async function main(input, blinkNumber = 25) {
    const array = input.split(' ')

    let tempArry = array
    for (let index = 0; index < blinkNumber; index++) {
        tempArry = handleMap(tempArry)
        console.log(tempArry.length)
    }
    return tempArry.length
}
module.exports = main

const handleMap = (array) => {
    return array.map(handleBlink).flat()
}

const handleBlink = (node) => {
    if (node == 0) {
        return '1'
    } else if (node.length % 2 === 0) {
        const midpoint = node.length / 2
        const firstHalf = node.slice(0, midpoint) // Extract first half
        const secondHalf = node.slice(midpoint) // Extract second half
        return [firstHalf, Number(secondHalf).toString()]
    } else {
        return (node * 2024).toString()
    }
}
