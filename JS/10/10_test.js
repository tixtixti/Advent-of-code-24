const test = require('node:test')
var assert = require('assert')

const task = require('./10.js')
//const task2 = require('./09-02.js')

test('calculates number of 09 correctly', async () => {
    const response = await task(1)
    assert.strictEqual(response, 611)
})

test('calculates number of 09-02 correctly', async () => {
    const response = await task(2)
    assert.strictEqual(response, 1380)
})
