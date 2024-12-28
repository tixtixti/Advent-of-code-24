const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const a = data.split("\n");
  const tuple = [];
  a.forEach((arr) => tuple.push(arr.split(" ")));

  const mapped = tuple.filter((arr) => {
    let isRising = arr[0] - arr[1] > 0;
    return arr.reduce((prev, value, idex, arrRef) =>
      idex === 0
        ? null
        : (idex !== arrRef.length - 1 &&
            value - arrRef[idex + 1] > 0 !== isRising) ||
          prev === false
        ? false
        : [1, 2, 3].includes(Math.abs(value - arrRef[idex - 1]))
    );
  }).length;

  console.log(mapped);
});
