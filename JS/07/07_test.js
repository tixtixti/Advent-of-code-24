const test = require('node:test')
var assert = require('assert')

const task = require('./07.js')
const task2 = require('./07-02.js')

test('calculates number of 07 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 3749)
})

test('calculates number of 07-02 correctly', async () => {
    const response = await task2()
    assert.strictEqual(response, 11387)
})
