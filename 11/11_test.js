const test = require('node:test')
var assert = require('assert')

const task = require('./11.js')
const task2 = require('./11-02.js')

test('calculates number of 11 correctly with small input', async () => {
    const response = await task('125 17')
    assert.strictEqual(response, 55312)
})

test('calculates number of 11 correctly with large input', async () => {
    const response = await task('64599 31 674832 2659361 1 0 8867 321')
    assert.strictEqual(response, 199986)
})

test('calculates number of 11-2 correctly with large input and 75 blinks', async () => {
    const response = await task2('64599 31 674832 2659361 1 0 8867 321', 75)
    assert.strictEqual(response, 236804088748754)
})
test('calculates number of 11-2 correctly with large input and 75 blinks', async () => {
    const response = await task2('64599 31 674832 2659361 1 0 8867 321')
    assert.strictEqual(response, 199986)
})
test('calculates number of 11-2 correctly with large input / 2', async () => {
    const response = await task2('125 17')
    assert.strictEqual(response, 55312)
})
