const test = require('node:test')
var assert = require('assert')

const task = require('./09.js')

test('calculates number of 09 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 1928)
})
