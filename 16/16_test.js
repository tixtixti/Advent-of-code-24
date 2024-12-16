const test = require('node:test')
var assert = require('assert')

const task = require('./16.js')

test('calculates number of 16-2-real correctly', async () => {
    const response = await task('input.txt')
    assert.strictEqual(response, 79404)
})
