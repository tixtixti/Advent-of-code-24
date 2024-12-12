const test = require('node:test')
var assert = require('assert')

const task = require('./12.js')

/*
test('calculates number of 12 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 1465112)
})
*/
test('calculates number of 12-2 correctly', async () => {
    const response = await task(true)
    assert.strictEqual(response, 1206)
})
