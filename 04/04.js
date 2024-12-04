const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // make 2d matrix
  const matrix2d = data.split("\n").map((node) => node.split(""));
  //  console.log(matrix2d);

  let amountOfXmas =
    calculateRows(matrix2d) +
    calcucateColumns(matrix2d) +
    calculateDiagonals(matrix2d);

  // calculate diagonals

  console.log({ amountOfXmas });

  calculateDiagonals(matrix2d);
});

const countXmas = (sampleArray) => {
  const xmasMatcher = /XMAS/g;
  const samxMatcher = /SAMX/g;
  const stringedArray = sampleArray.join("");
  const xmmatches = stringedArray.match(xmasMatcher);
  const smmatches = stringedArray.match(samxMatcher);
  const abba = xmmatches ? xmmatches.length : 0;
  const babba = smmatches ? smmatches.length : 0;
  return abba + babba;
};

const calculateRows = (matrix) => {
  return matrix.reduce((prev, row) => {
    // const backToBack = row.join("");
    // console.log(backToBack.match(xmasMatcher));
    return prev + countXmas(row);
  }, 0);
};

const calcucateColumns = (matrix) => {
  return matrix.reduce((prev, row, index, self) => {
    let pystyrivi = [];
    row.forEach((item, indexCol) => {
      pystyrivi.push(self[indexCol][index]);
    });
    // console.log(pystyrivi.join(""));
    return prev + countXmas(pystyrivi);
  }, 0);
};

const calculateDiagonals = (matrix) => {
  let allDiagonals = [];
  const numRows = matrix.length; // montako riviä
  const numCols = matrix[0].length; // montako per rivi

  for (let start = 0; start < numRows; start++) {
    let diagonal = [];
    let row = start,
      col = 0;
    while (row < numRows && col < numCols) {
      diagonal.push(matrix[row][col]);
      row++;
      col++;
    }
    allDiagonals.push(diagonal);
    // console.log({ diagonal, count: countXmas(diagonal) });
  }

  for (let start = 1; start < numCols; start++) {
    let diagonal = [];
    let row = 0,
      col = start;
    while (row < numRows && col < numCols) {
      diagonal.push(matrix[row][col]);
      row++;
      col++;
    }
    allDiagonals.push(diagonal);
    //   console.log({ diagonal, count: countXmas(diagonal) });
  }

  for (let start = 0; start < numRows; start++) {
    let diagonal = [];
    let row = start,
      col = numCols - 1;
    while (row < numRows && col >= 0) {
      diagonal.push(matrix[row][col]);
      row++;
      col--;
    }
    allDiagonals.push(diagonal);
    // console.log({ diagonal, count: countXmas(diagonal) });
  }

  for (let start = numCols - 2; start >= 0; start--) {
    let diagonal = [];
    let row = 0,
      col = start;
    while (row < numRows && col >= 0) {
      diagonal.push(matrix[row][col]);
      row++;
      col--;
    }
    allDiagonals.push(diagonal);
    //  console.log({ diagonal, count: countXmas(diagonal) });
  }

  return allDiagonals.reduce((prev, curr) => {
    return prev + countXmas(curr);
  }, 0);
};
