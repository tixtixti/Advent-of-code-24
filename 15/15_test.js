const test = require('node:test')
var assert = require('assert')

const task = require('./15.js')

test('calculates number of 15-1-small correctly', async () => {
    const response = await task('it.txt')
    assert.strictEqual(response, 2028)
})

test('calculates number of 15-1-test correctly', async () => {
    const response = await task('test.txt')
    assert.strictEqual(response, 10092)
})

test('calculates number of 15-1-real correctly', async () => {
    const response = await task('input.txt')
    assert.strictEqual(response, 1438161)
})
