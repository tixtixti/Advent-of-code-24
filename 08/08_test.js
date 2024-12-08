const test = require('node:test')
var assert = require('assert')

const task = require('./08.js')

test('calculates number of 08 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 14)
})
