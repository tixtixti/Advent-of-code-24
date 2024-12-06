const test = require('node:test')
var assert = require('assert')
const task = require('./06.js')

test('calculates number of 05 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 5177)
})
1
