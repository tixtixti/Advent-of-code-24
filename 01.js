const fs = require('node:fs')

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const listOne = []
  const listTwo = []

  data.match(/\b\d{5}\b/g).forEach((element, index) => {
    index % 2 ? listTwo.push(element) : listOne.push(element)
  })

  listOne.sort()
  listTwo.sort()
  console.log(
    listOne.reduce(
      (prev, curr, index) => prev + Math.abs(curr - listTwo[index]),
      0
    )
  )
})
