const test = require('node:test')
var assert = require('assert')

const task = require('./14.js')

test('calculates number of 14-1 correctly', async () => {
    const response = await task('it.txt')
    assert.strictEqual(response, 12)
})

test('calculates number of 14-1-iso correctly', async () => {
    const response = await task('input.txt', true)
    assert.strictEqual(response, 224357412) // 239382000 too high // 224014560 väärä
})
