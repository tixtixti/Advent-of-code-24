const fs = require('node:fs').promises

async function main() {
  try {
    const data = await fs.readFile('input.txt', 'utf8')
    const matrix2d = data.split('\n').map((node) => node.split(''))

    return (
      calculateRows(matrix2d) +
      calculateColumns(matrix2d) +
      calculateDiagonals(matrix2d)
    )
  } catch (e) {
    console.log(e)
  }
}

const countXmas = (sampleArray) => {
  const stringedArray = sampleArray.join('')
  const xmmatches = stringedArray.match(/XMAS/g)
  const smmatches = stringedArray.match(/SAMX/g)

  return (xmmatches ? xmmatches.length : 0) + (smmatches ? smmatches.length : 0)
}

const calculateRows = (matrix) =>
  matrix.reduce((prev, row) => prev + countXmas(row), 0)

const calculateColumns = (matrix) =>
  matrix.reduce(
    (prev, row, index, self) =>
      prev +
      countXmas(
        row.map((_item, indexCol) => {
          return self[indexCol] ? self[indexCol][index] : ''
        })
      ),
    0
  )

const calculateDiagonals = (matrix) => {
  let allDiagonals = []
  const numRows = matrix.length
  const numCols = matrix[0].length

  for (let start = 0; start < numRows; start++) {
    let diagonal = []
    let row = start,
      col = 0
    while (row < numRows && col < numCols) {
      diagonal.push(matrix[row][col])
      row++
      col++
    }
    allDiagonals.push(diagonal)
  }

  for (let start = 1; start < numCols; start++) {
    let diagonal = []
    let row = 0,
      col = start
    while (row < numRows && col < numCols) {
      diagonal.push(matrix[row][col])
      row++
      col++
    }
    allDiagonals.push(diagonal)
  }

  for (let start = 0; start < numRows; start++) {
    let diagonal = []
    let row = start,
      col = numCols - 1
    while (row < numRows && col >= 0) {
      diagonal.push(matrix[row][col])
      row++
      col--
    }
    allDiagonals.push(diagonal)
  }

  for (let start = numCols - 2; start >= 0; start--) {
    let diagonal = []
    let row = 0,
      col = start
    while (row < numRows && col >= 0) {
      diagonal.push(matrix[row][col])
      row++
      col--
    }
    allDiagonals.push(diagonal)
  }

  return allDiagonals.reduce((prev, curr) => {
    return prev + countXmas(curr)
  }, 0)
}

module.exports = main
