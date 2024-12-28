const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let isCaluclating = true;

  console.log(
    data
      .match(/(don't\(\))|(do\(\))|(mul\(\d{1,3},\d{1,3}\))/g)
      .reduce((score, node) => {
        if (node.match(/(do\(\))/g)) isCaluclating = true;
        if (node.match(/(don't\(\))/g)) isCaluclating = false;
        if (isCaluclating && node.match(/\d{1,3},\d{1,3}/g)) {
          const abba = node.match(/\d{1,3},\d{1,3}/g)[0].split(",");
          return score + abba[0] * abba[1];
        }
        return score;
      }, 0)
  );
});
