var _ = require("lodash");


export type GridType = number[][];



export function decimalToBinary(decimalNumber: number) {
  return decimalNumber.toString(2).padStart(9, "0");
}

export function binarySetToDecimalSet(binaryNumber: string) {
  return parseInt(binaryNumber, 2);
}

export function decimalSetHasNumber(decimalSet: number, number : number) {
  let binarySet = decimalNumberToBinarySet(number);
  return (decimalSet & binarySet) === binarySet;
}

export function decimalNumberToBinarySet(decimalNumber: number) {
  return 1 << (decimalNumber - 1);
}

export function addDecimalNumberToDecimalSet(
  decimalSet: number,
  decimalNumber: number
) {
  return decimalSet | decimalNumberToBinarySet(decimalNumber);
}

export function getMissingBinarySetFromBinarySet(binarySet: number) {
  return binarySetToDecimalSet("111111111") & ~binarySet;
}

export function decimalSetToNumbersList(decimalSet: number) {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => {
    if (decimalSetHasNumber(decimalSet, number)) {
      return number;
    }
  });
}

export function getRowsSetsFromGrid(grid : GridType) {
  let rowsSets : number[]= [];

  grid.forEach((row) => {
    let decimalSet = 0;

    row.forEach((number) => {
      if (number !== 0) {
        decimalSet = addDecimalNumberToDecimalSet(decimalSet, number);
      }
    });

    rowsSets.push(decimalSet);
  });

  return rowsSets;
}

export function getColumnsSetsFromGrid(grid : GridType) {
  let columnSets = [];

  for (let i = 0; i < grid.length; i++) {
    let decimalSet = 0;

    for (let j = 0; j < grid.length; j++) {
      let number = grid[j][i];

      if (number !== 0) {
        decimalSet = addDecimalNumberToDecimalSet(decimalSet, number);
      }
    }
    columnSets.push(decimalSet);
  }

  return columnSets;
}

export function getSquaresSetsFromGrid(grid : GridType) {
  let squaresSet = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let squaresSetIndice = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      let number = grid[i][j];
      squaresSetIndice = Math.floor(j / 3) + Math.floor(i / 3) * 3;

      if (number !== 0) {
        squaresSet[squaresSetIndice] = addDecimalNumberToDecimalSet(
          squaresSet[squaresSetIndice],
          number
        );
      }
    }
  }

  return squaresSet;
}

export function specificColumnHasNumber(
  columnsSets : number[],
  columnNumber: number,
  decimalNumber: number
) {
  return decimalSetHasNumber(columnsSets[columnNumber], decimalNumber);
}

export function specificRowHasNumber(
  rowsSets : number[],
  rowNumber: number,
  decimalNumber: number
) {
  return decimalSetHasNumber(rowsSets[rowNumber], decimalNumber);
}

export function specificSquareHasNumber(
  squareSets : number[],
  squareNumber: number,
  decimalNumber: number
) {
  return decimalSetHasNumber(squareSets[squareNumber], decimalNumber);
}

export function mergeDecimalSets(
  firstDecimalSets: number,
  secondDecimalSets: number
) {
  return firstDecimalSets | secondDecimalSets;
}

export function getSetsForSpotOnGrid(
  row : number,
  column : number,
  columnsSets : number[],
  rowsSets : number[],
  squaresSets : number[]
) {
  let squaresSetIndice = Math.floor(column / 3) + Math.floor(row / 3) * 3;

  const squaresSet = squaresSets[squaresSetIndice];
  const rowSet = rowsSets[row];
  const columnSet = columnsSets[column];

  return mergeDecimalSets(mergeDecimalSets(squaresSet, rowSet), columnSet);
}

export function displayGrid(grid: GridType) {
  console.log(displayGridStr(grid));
}

export function displayGridStr(grid: GridType) {
  let gridToDisplay = "";
  for (let i = 0; i < grid.length; i++) {
    if (i % 3 === 0)
      gridToDisplay += "  ----------------------------------" + "\n";

    for (let j = 0; j < grid.length; j++) {
      if (j % 3 === 0) gridToDisplay += " | ";
      gridToDisplay += ` ${grid[i][j] === 0 ? "-" : grid[i][j]} `;
    }
    gridToDisplay += "| \n";
  }
  gridToDisplay += "  ----------------------------------" + "\n";

  return gridToDisplay;
}

export function hasEmptySpot(grid: GridType) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

export function bestSpotWithFewerPossibility (grid:number[][]):[i:number, j:number, possibilities:number[]]  {
  if (!hasEmptySpot(grid)) {
    return [-1, -1, []];
  }

  let amountOfPossibilities = 20;
  let row = -1;
  let column = -1;
  let possibilities:number[] =[];

  let columnsSets = getColumnsSetsFromGrid(grid);
  let rowsSets = getRowsSetsFromGrid(grid);
  let squaresSets = getSquaresSetsFromGrid(grid);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] !== 0) continue;

      let setsForSpotOnGrid = getSetsForSpotOnGrid(
        i,
        j,
        columnsSets,
        rowsSets,
        squaresSets
      );

      let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid
      );

      let listOfPossibilityForSpecificSpot:number[] = decimalSetToNumbersList(
        missingSetsForSpotOnGrid
      );

      if (listOfPossibilityForSpecificSpot.length === 1) {
        return [i, j, listOfPossibilityForSpecificSpot];
      } else {
        if (amountOfPossibilities > listOfPossibilityForSpecificSpot.length) {
          amountOfPossibilities = listOfPossibilityForSpecificSpot.length;
          row = i;
          column = j;
          possibilities = listOfPossibilityForSpecificSpot;
        }
      }
    }
  }

  return [row, column, possibilities];
}

export function listOfPossibilityForSpecificSpot(grid: GridType, i:number, j:number) {
  let columnsSets = getColumnsSetsFromGrid(grid);
  let rowsSets = getRowsSetsFromGrid(grid);
  let squaresSets = getSquaresSetsFromGrid(grid);

  let setsForSpotOnGrid = getSetsForSpotOnGrid(
    i,
    j,
    columnsSets,
    rowsSets,
    squaresSets
  );

  let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
    setsForSpotOnGrid
  );

  return decimalSetToNumbersList(missingSetsForSpotOnGrid);
}

export function resolve(grid: GridType, result : GridType[]) {
  const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

  if (i === -1 && j === -1) {
    //displayGrid(grid);
    result.push(grid);
    return;
  }

  possibilities.forEach((possibility) => {
    const newGrid = _.cloneDeep(grid);

    newGrid[i][j] = possibility;

    return resolve(newGrid, result);
  });
}
