const test = require('node:test')
var assert = require('assert')

const task = require('./17.js')
/*
test('calculates number of 17-1-test correctly', async () => {
    const response = await task('it.txt')
    assert.deepEqual(response, '4,6,3,5,6,3,5,2,1,0')
})

test('calculates number of 17-2-real correctly', async () => {
    const response = await task('input.txt')
    assert.strictEqual(
        response.split(',').length,
        '2,4,1,5,7,5,0,3,4,1,1,6,5,5,3,0'.split(',').length
    )
    assert.deepEqual(response, '2,4,1,5,7,5,0,3,4,1,1,6,5,5,3,0')
})
*/
test('calculates number of 17-1-real correctly', async () => {
    const response = await task('superSmall.txt')
    assert.strictEqual(response, '7,0,3,1,2,6,3,7,1')
})
