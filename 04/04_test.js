const test = require('node:test')
var assert = require('assert')
const task = require('./04.js')

test('calculates number of XMAS correctly', async () => {
  const response = await task()
  assert.strictEqual(response, 2534)
})
