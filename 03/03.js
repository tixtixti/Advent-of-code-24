const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(
    data
      .match(/mul\(\d{1,3},\d{1,3}\)/g)
      .map((node) => node.match(/\d{1,3},\d{1,3}/g)[0].split(","))
      .reduce((prev, curr) => prev + curr[0] * curr[1], 0)
  );
});
