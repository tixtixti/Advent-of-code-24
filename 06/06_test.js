const test = require('node:test')
var assert = require('assert')

const task = require('./06.js')
const task2 = require('./06-02.js')

test('calculates number of 06 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 5177)
})
test('calculates number of 06-02 correctly', async () => {
    const response2 = await task2()
    assert.strictEqual(response2.length, 6)
    assert.strictEqual(
        JSON.stringify([
            [6, 3],
            [7, 6],
            [8, 3],
            [8, 1],
            [7, 7],
            [9, 7],
        ]),
        JSON.stringify(response2)
    )
})
