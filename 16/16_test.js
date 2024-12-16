const test = require('node:test')
var assert = require('assert')

const task = require('./16.js')
/*
test('calculates number of 16-1-small correctly', async () => {
    const response = await task('it.txt')
    assert.strictEqual(response, 7036)
})
test('calculates number of 16-1-small-2 correctly', async () => {
    const response = await task('i.txt')
    assert.strictEqual(response, 11048)
}) 
    */
test('calculates number of 16-1-real correctly', async () => {
    const response = await task('input.txt')
    assert.strictEqual(response, 79404)
})
