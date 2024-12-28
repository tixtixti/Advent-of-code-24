const test = require('node:test')
var assert = require('assert')

const task = require('./08.js')
const task2 = require('./08-02.js')

test('calculates number of 08 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 354)
})

test('calculates number of 08-02 correctly', async () => {
    const response2 = await task2()
    assert.strictEqual(response2, 1263)
})
