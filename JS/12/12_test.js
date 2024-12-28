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
    const response = await task('supersimple.txt')
    assert.strictEqual(response, 80)
})

test('calculates number of 12-2-1 correctly', async () => {
    const response = await task('it.txt')
    assert.strictEqual(response, 236)
})
test('calculates number of 12-2-iso correctly', async () => {
    const response = await task('testinput.txt')
    assert.strictEqual(response, 1206)
})
test('calculates number of 12-2-inside correctly', async () => {
    const response = await task('rip.txt')
    assert.strictEqual(response, 368)
})

test('calculates number of 12-2-actual correctly', async () => {
    const response = await task('input.txt')
    assert.strictEqual(response, 893790) // 896000 too high
})
