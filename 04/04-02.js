const fs = require('node:fs')

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  // make 2d matrix
  const matrix2d = data.split('\n').map((node) => node.split(''))

  let count = 0
  matrix2d.forEach((row, rowIndex) => {
    row.forEach((node, idex) => {
      const currentMarker = node
      if (isEitherSorM(node)) {
        // correct start
        if (
          matrix2d[rowIndex + 1] &&
          matrix2d[rowIndex + 1][idex + 1] === 'A'
        ) {
          if (matrix2d[rowIndex + 2]) {
            lastMarker = matrix2d[rowIndex + 2][idex + 2]
            if (isOtherThanPrevious(lastMarker, currentMarker)) {
              const backMarker = matrix2d[rowIndex + 2][idex]
              if (isEitherSorM(backMarker, lastMarker)) {
                if (isOtherThanPrevious(row[idex + 2], backMarker)) {
                  count++
                }
              }
            }
          }
        }
      }
    })
  })
  console.log(count)
})

const isEitherSorM = (input) => input === 'S' || input == 'M'
const isOtherThanPrevious = (input, prvevious) =>
  (input === 'S' && prvevious === 'M') || (input == 'M' && prvevious === 'S')
