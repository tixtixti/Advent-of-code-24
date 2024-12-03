const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const a = data.match(/mul\(\d{1,3},\d{1,3}\)/g).map((node) => {
    return node.match(/\d{1,3},\d{1,3}/g)[0].split(",");
  });
  const abba = a.reduce((prev, curr) => {
    return prev + curr[0] * curr[1];
  }, 0);
  console.log(abba);
});
