const test = require('node:test')
var assert = require('assert')

const task = require('./13.js')

test('calculates number of 12-2 correctly', async () => {
    const response = await task('it.txt')
    assert.strictEqual(response, 99548032866004)
})
