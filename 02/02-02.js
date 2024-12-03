const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const a = data.split("\n");
  const tuple = [];
  const remakeTuple = [];
  a.forEach((arr) => tuple.push(arr.split(" ")));
  // console.log(tuple);

  const filterGoodOnes = tuple.filter(calculations);
  const filterBadOnes = tuple.filter((arr) => {
    return !calculations(arr);
  });
  //console.log(filterGoodOnes.length);
  console.log(filterBadOnes.length); // jokaisessa on 1 tai useampi virhe

  filterBadOnes.map((arr) => {
    return arr.reduce((prev, value, idex, arrRef) => {
      if (idex === 0) {
        return null;
      }
      if (prev === false) {
        return false;
      }
      if (idex !== arrRef.length - 1) {
        const distanceToPrevious = value - arrRef[idex - 1];
        const distanceToNext = value - arrRef[idex + 1];
        const toPreviousAboveZero = distanceToPrevious > 0;
        const toNextAboveZero = distanceToNext > 0;
        const absoluteDistanceToPrevious = Math.abs(distanceToPrevious);
        const absoluteDistanceTonext = Math.abs(distanceToNext);
        const sharePostivity = toPreviousAboveZero === toNextAboveZero;
        const positiveOverThree = ![1, 2, 3].includes(
          absoluteDistanceToPrevious
        );
        const positiveOverThreeNext = ![1, 2, 3].includes(
          absoluteDistanceTonext
        );
        if (sharePostivity || positiveOverThree || positiveOverThreeNext) {
          const abba = new Map();
          const withOutPrevious = [...arrRef].filter(
            (node, idx) => idx !== idex - 1
          );
          const withOutCurrent = [...arrRef].filter(
            (node, idx) => idx !== idex
          );
          const withOutNext = [...arrRef].filter(
            (node, idx) => idx !== idex + 1
          );
          const thisArrays = [];
          abba.set(withOutPrevious.toString(), withOutPrevious);
          abba.set(withOutCurrent.toString(), withOutCurrent);
          abba.set(withOutNext.toString(), withOutNext);

          const babbaArray = Array.from(abba.values());
          babbaArray.forEach((arra) => {
            thisArrays.push(arra);
          });
          const abba2 = thisArrays.filter(calculations);
          if (abba2.length > 0) {
            remakeTuple.push(abba2[0]);
          }

          return false;
        }
      } else {
        return true;
      }
    }, true);
  });

  console.log(remakeTuple);
  const virheelliset = calculateGoodOnes(remakeTuple);
  console.log({ virheelliset });
  const orggis = filterGoodOnes.length;
  // console.log({ orggis });
  console.log(orggis + virheelliset);
});

const calculateGoodOnes = (tuple) => {
  return tuple.map(calculations).reduce((prev, curr) => {
    return curr ? prev + 1 : prev;
  }, 0);
};

const calculations = (arr) => {
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
};
