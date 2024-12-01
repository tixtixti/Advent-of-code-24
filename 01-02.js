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

  const map1 = new Map()
  listTwo.forEach((a) =>
    map1.get(a) ? map1.set(a, map1.get(a) + 1) : map1.set(a, 1)
  )
  console.log(
    listOne.reduce(
      (prev, curr) => (map1.get(curr) ? prev + curr * map1.get(curr) : prev),
      0
    )
  )
})
