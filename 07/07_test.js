const test = require('node:test')
var assert = require('assert')

const task = require('./07.js')

test('calculates number of 07 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 3749)
})
