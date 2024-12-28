const test = require('node:test')
var assert = require('assert')

const task = require('./09.js')
const task2 = require('./09-02.js')

test('calculates number of 09 correctly', async () => {
    const response = await task()
    assert.strictEqual(response, 6320029754031)
})

test('calculates number of 09-02 correctly', async () => {
    const response = await task2()
    assert.strictEqual(response, 6347435485773)
})
