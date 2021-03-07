import * as _ from "lodash";

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
  // eslint-disable-next-line 
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
    if (i % 3 === 0){

      // eslint-disable-next-line 
      gridToDisplay += "  ----------------------------------" + "\n";
    }

    for (let j = 0; j < grid.length; j++) {
      if (j % 3 === 0) gridToDisplay += " | ";
      gridToDisplay += ` ${grid[i][j] === 0 ? "-" : grid[i][j]} `;
    }
    gridToDisplay += "| \n";
  }
  // eslint-disable-next-line 
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

export function countNumbersInGrid(grid: GridType) {
  let counter = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] !== 0) {
        counter++;
      }
    }
  }

  return counter;
}

export function countEmptySpotsInGrid(grid: GridType) {
  return 81 - countNumbersInGrid(grid);
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

export function listOfPossibilityForSpecificSpot(grid: GridType, i:number, j:number):number[] {
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
    result.push(grid);
  } else {

    
    possibilities.forEach((possibility) => {
      const newGrid = _.cloneDeep(grid);
      
      newGrid[i][j] = possibility;
      
      resolve(newGrid, result);
    });
  }
}


function randomIntFromInterval(min:number, max:number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export function generateGrid(fullGrid: GridType, emptyNumberNeeded :number) {
  while (emptyNumberNeeded !== countEmptySpotsInGrid(fullGrid)){

    let randomRow = randomIntFromInterval(0,8);
    let randomColumn = randomIntFromInterval(0,8);

      if (fullGrid[randomRow][randomColumn] === 0) continue;

      fullGrid[randomRow][randomColumn] = 0;
    }
}



export function displayGridAsJavascriptArray(grid: GridType) {
  let gridToDisplay = "[";
  for (let i = 0; i < grid.length; i++) {
    gridToDisplay += "[";

    for (let j = 0; j < grid.length; j++) {
        gridToDisplay += `${grid[i][j]},`;
     
    }

      gridToDisplay += "],";
  
  }
  // eslint-disable-next-line
  gridToDisplay += "]";

  return gridToDisplay;
}

// const fullGridT = [
//   [5, 4, 3, 6, 1, 9, 7, 2, 8],
//   [8, 6, 1, 2, 3, 7, 9, 4, 5],
//   [7, 9, 2, 8, 5, 4, 1, 3, 6],
//   [3, 1, 5, 4, 7, 8, 2, 6, 9],
//   [9, 2, 8, 5, 6, 1, 4, 7, 3],
//   [4, 7, 6, 9, 2, 3, 5, 8, 1],
//   [2, 8, 4, 1, 9, 6, 3, 5, 7],
//   [6, 3, 9, 7, 4, 5, 8, 1, 2],
//   [1, 5, 7, 3, 8, 2, 6, 9, 4],
// ];

// generateGrid(fullGridT,57)

// console.log(displayGridStr(fullGridT));

// const resultTemp: GridType[] = [];

// resolve(fullGridT,resultTemp)

// let str = "[";

// resultTemp.map(grid => {
//     str+=displayGridAsJavascriptArray(grid)
//     str+= ","
// })

// str+=']'

// console.log(str);

// console.log(resultTemp.length, " results !!!");


const ALL_THE_SOLUTIONS = [
  [
    [6, 4, 3, 5, 1, 9, 2, 7, 8],
    [8, 9, 1, 6, 2, 7, 3, 4, 5],
    [7, 5, 2, 8, 3, 4, 6, 9, 1],
    [3, 1, 5, 2, 7, 8, 4, 6, 9],
    [4, 7, 8, 9, 6, 1, 5, 2, 3],
    [9, 2, 6, 4, 5, 3, 1, 8, 7],
    [2, 8, 4, 1, 9, 5, 7, 3, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 3, 8, 2, 9, 1, 4],
  ],
  [
    [6, 4, 3, 5, 1, 9, 2, 7, 8],
    [8, 9, 1, 6, 2, 7, 3, 4, 5],
    [7, 5, 2, 8, 3, 4, 1, 9, 6],
    [3, 1, 5, 4, 7, 8, 6, 2, 9],
    [9, 2, 8, 1, 6, 5, 7, 3, 4],
    [4, 7, 6, 2, 9, 3, 5, 8, 1],
    [2, 8, 4, 3, 5, 1, 9, 6, 7],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 9, 8, 2, 4, 1, 3],
  ],

  [
    [6, 4, 3, 5, 1, 9, 7, 2, 8],
    [8, 9, 1, 6, 2, 7, 3, 4, 5],
    [7, 2, 5, 8, 3, 4, 1, 9, 6],
    [3, 1, 2, 4, 7, 8, 5, 6, 9],
    [9, 5, 8, 2, 6, 1, 4, 7, 3],
    [4, 7, 6, 3, 9, 5, 2, 8, 1],
    [2, 8, 4, 9, 5, 3, 6, 1, 7],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 1, 8, 2, 9, 3, 4],
  ],

  [
    [5, 4, 3, 6, 1, 9, 7, 2, 8],
    [8, 9, 1, 3, 2, 7, 6, 4, 5],
    [7, 6, 2, 8, 5, 4, 9, 3, 1],
    [4, 1, 5, 7, 3, 8, 2, 6, 9],
    [9, 2, 8, 4, 6, 1, 3, 5, 7],
    [3, 7, 6, 2, 9, 5, 1, 8, 4],
    [2, 8, 4, 9, 7, 3, 5, 1, 6],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [6, 5, 7, 1, 8, 2, 4, 9, 3],
  ],

  [
    [7, 4, 3, 1, 5, 9, 2, 6, 8],
    [8, 9, 1, 6, 2, 7, 3, 4, 5],
    [6, 5, 2, 8, 3, 4, 1, 9, 7],
    [4, 1, 5, 2, 7, 8, 6, 3, 9],
    [9, 7, 8, 3, 6, 1, 5, 2, 4],
    [3, 2, 6, 4, 9, 5, 7, 8, 1],
    [2, 8, 4, 5, 1, 3, 9, 7, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 9, 8, 2, 4, 1, 3],
  ],

  [
    [7, 4, 3, 1, 5, 9, 6, 2, 8],
    [8, 9, 1, 6, 2, 7, 3, 4, 5],
    [6, 5, 2, 8, 3, 4, 7, 9, 1],
    [3, 1, 5, 2, 7, 8, 4, 6, 9],
    [4, 2, 8, 9, 6, 3, 1, 5, 7],
    [9, 7, 6, 4, 1, 5, 2, 8, 3],
    [2, 8, 4, 7, 9, 1, 5, 3, 6],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [5, 6, 7, 3, 8, 2, 9, 1, 4],
  ],

  [
    [7, 4, 3, 6, 5, 9, 1, 2, 8],
    [8, 6, 1, 3, 2, 7, 9, 4, 5],
    [9, 2, 5, 8, 1, 4, 7, 3, 6],
    [5, 1, 2, 4, 7, 8, 3, 6, 9],
    [3, 9, 8, 2, 6, 1, 5, 7, 4],
    [4, 7, 6, 5, 9, 3, 2, 8, 1],
    [2, 8, 4, 9, 3, 5, 6, 1, 7],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 1, 8, 2, 4, 9, 3],
  ],

  [
    [7, 4, 3, 6, 5, 9, 1, 2, 8],
    [8, 9, 1, 3, 2, 7, 6, 4, 5],
    [6, 5, 2, 8, 1, 4, 3, 9, 7],
    [3, 1, 5, 2, 7, 8, 4, 6, 9],
    [9, 2, 8, 4, 6, 1, 5, 7, 3],
    [4, 7, 6, 5, 9, 3, 2, 8, 1],
    [2, 8, 4, 9, 3, 5, 7, 1, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 1, 8, 2, 9, 3, 4],
  ],

  [
    [7, 4, 3, 6, 5, 9, 2, 1, 8],
    [8, 6, 1, 3, 2, 7, 9, 4, 5],
    [9, 2, 5, 8, 1, 4, 6, 7, 3],
    [5, 1, 2, 4, 7, 8, 3, 6, 9],
    [4, 9, 8, 1, 6, 3, 5, 2, 7],
    [3, 7, 6, 2, 9, 5, 1, 8, 4],
    [2, 8, 4, 5, 3, 6, 7, 9, 1],
    [6, 3, 9, 7, 4, 1, 8, 5, 2],
    [1, 5, 7, 9, 8, 2, 4, 3, 6],
  ],

  [
    [5, 4, 3, 6, 1, 9, 2, 7, 8],
    [8, 6, 1, 2, 3, 7, 9, 4, 5],
    [7, 9, 2, 8, 5, 4, 1, 6, 3],
    [3, 1, 5, 4, 7, 8, 6, 2, 9],
    [4, 2, 8, 9, 6, 3, 5, 1, 7],
    [9, 7, 6, 1, 2, 5, 3, 8, 4],
    [2, 8, 4, 5, 9, 1, 7, 3, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 3, 8, 2, 4, 9, 1],
  ],

  [
    [7, 4, 3, 6, 5, 9, 1, 2, 8],
    [8, 9, 1, 2, 3, 7, 6, 4, 5],
    [6, 5, 2, 8, 1, 4, 7, 9, 3],
    [3, 1, 5, 7, 2, 8, 4, 6, 9],
    [9, 2, 8, 4, 6, 1, 3, 5, 7],
    [4, 7, 6, 3, 9, 5, 2, 8, 1],
    [2, 8, 4, 9, 7, 3, 5, 1, 6],
    [5, 3, 9, 1, 4, 6, 8, 7, 2],
    [1, 6, 7, 5, 8, 2, 9, 3, 4],
  ],

  [
    [7, 4, 3, 6, 5, 9, 2, 1, 8],
    [8, 6, 1, 2, 3, 7, 9, 4, 5],
    [9, 2, 5, 8, 1, 4, 7, 6, 3],
    [5, 1, 2, 4, 7, 8, 6, 3, 9],
    [3, 9, 8, 5, 6, 1, 4, 2, 7],
    [4, 7, 6, 9, 2, 3, 5, 8, 1],
    [2, 8, 4, 3, 9, 5, 1, 7, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 1, 8, 2, 3, 9, 4],
  ],

  [
    [7, 4, 3, 6, 5, 9, 2, 1, 8],
    [8, 9, 1, 2, 3, 7, 6, 4, 5],
    [6, 2, 5, 8, 1, 4, 7, 9, 3],
    [4, 1, 2, 3, 7, 8, 5, 6, 9],
    [3, 7, 8, 9, 6, 5, 4, 2, 1],
    [9, 5, 6, 4, 2, 1, 3, 8, 7],
    [2, 8, 4, 7, 9, 3, 1, 5, 6],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [5, 6, 7, 1, 8, 2, 9, 3, 4],
  ],

  [
    [6, 4, 3, 5, 1, 9, 2, 7, 8],
    [8, 2, 1, 6, 3, 7, 9, 4, 5],
    [7, 9, 5, 8, 2, 4, 1, 3, 6],
    [3, 1, 2, 4, 7, 8, 5, 6, 9],
    [9, 5, 8, 3, 6, 1, 7, 2, 4],
    [4, 7, 6, 2, 9, 5, 3, 8, 1],
    [2, 8, 4, 1, 5, 3, 6, 9, 7],
    [5, 3, 9, 7, 4, 6, 8, 1, 2],
    [1, 6, 7, 9, 8, 2, 4, 5, 3],
  ],

  [
    [6, 4, 3, 5, 2, 9, 7, 1, 8],
    [8, 2, 1, 6, 3, 7, 9, 4, 5],
    [9, 7, 5, 8, 1, 4, 2, 3, 6],
    [3, 1, 2, 4, 7, 8, 5, 6, 9],
    [7, 9, 8, 3, 6, 5, 1, 2, 4],
    [4, 5, 6, 2, 9, 1, 3, 8, 7],
    [2, 8, 4, 7, 5, 3, 6, 9, 1],
    [5, 3, 9, 1, 4, 6, 8, 7, 2],
    [1, 6, 7, 9, 8, 2, 4, 5, 3],
  ],

  [
    [7, 4, 3, 1, 5, 9, 6, 2, 8],
    [8, 2, 1, 6, 3, 7, 9, 4, 5],
    [6, 9, 5, 8, 2, 4, 1, 7, 3],
    [4, 1, 2, 5, 7, 8, 3, 6, 9],
    [9, 7, 8, 2, 6, 3, 5, 1, 4],
    [3, 5, 6, 4, 9, 1, 2, 8, 7],
    [2, 8, 4, 3, 1, 5, 7, 9, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 9, 8, 2, 4, 3, 1],
  ],
  [
    [7, 4, 3, 1, 5, 9, 6, 2, 8],
    [8, 2, 1, 6, 3, 7, 9, 4, 5],
    [9, 6, 5, 8, 2, 4, 1, 7, 3],
    [5, 1, 2, 4, 7, 8, 3, 6, 9],
    [4, 9, 8, 5, 6, 3, 2, 1, 7],
    [3, 7, 6, 2, 9, 1, 5, 8, 4],
    [2, 8, 4, 3, 1, 5, 7, 9, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 9, 8, 2, 4, 3, 1],
  ],

  [
    [7, 4, 3, 2, 5, 9, 1, 6, 8],
    [8, 9, 1, 6, 3, 7, 2, 4, 5],
    [6, 5, 2, 8, 1, 4, 9, 3, 7],
    [3, 1, 5, 4, 7, 8, 6, 2, 9],
    [9, 2, 8, 3, 6, 1, 5, 7, 4],
    [4, 7, 6, 9, 2, 5, 3, 8, 1],
    [2, 8, 4, 1, 9, 3, 7, 5, 6],
    [5, 3, 9, 7, 4, 6, 8, 1, 2],
    [1, 6, 7, 5, 8, 2, 4, 9, 3],
  ],

  [
    [7, 4, 3, 5, 2, 9, 1, 6, 8],
    [8, 9, 1, 6, 3, 7, 2, 4, 5],
    [5, 6, 2, 8, 1, 4, 3, 9, 7],
    [3, 1, 5, 4, 7, 8, 6, 2, 9],
    [4, 2, 8, 9, 6, 1, 5, 7, 3],
    [9, 7, 6, 2, 5, 3, 4, 8, 1],
    [2, 8, 4, 3, 9, 5, 7, 1, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 1, 8, 2, 9, 3, 4],
  ],

  [
    [6, 4, 3, 2, 5, 9, 7, 1, 8],
    [8, 9, 1, 6, 3, 7, 2, 4, 5],
    [7, 2, 5, 8, 1, 4, 3, 9, 6],
    [3, 1, 2, 5, 7, 8, 4, 6, 9],
    [4, 5, 8, 9, 6, 3, 1, 2, 7],
    [9, 7, 6, 4, 2, 1, 5, 8, 3],
    [2, 8, 4, 7, 9, 5, 6, 3, 1],
    [5, 3, 9, 1, 4, 6, 8, 7, 2],
    [1, 6, 7, 3, 8, 2, 9, 5, 4],
  ],

  [
    [5, 4, 3, 6, 2, 9, 1, 7, 8],
    [8, 6, 2, 1, 3, 7, 9, 4, 5],
    [7, 9, 1, 8, 5, 4, 6, 2, 3],
    [3, 1, 5, 4, 7, 8, 2, 6, 9],
    [9, 7, 8, 2, 6, 5, 3, 1, 4],
    [4, 2, 6, 3, 9, 1, 5, 8, 7],
    [2, 8, 4, 5, 1, 3, 7, 9, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 9, 8, 2, 4, 3, 1],
  ],

  [
    [5, 4, 3, 6, 2, 9, 7, 1, 8],
    [8, 6, 2, 3, 1, 7, 9, 4, 5],
    [9, 7, 1, 8, 5, 4, 3, 2, 6],
    [3, 1, 5, 4, 7, 8, 2, 6, 9],
    [4, 9, 8, 2, 6, 1, 5, 3, 7],
    [7, 2, 6, 9, 3, 5, 1, 8, 4],
    [2, 8, 4, 5, 9, 3, 6, 7, 1],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 1, 8, 2, 4, 9, 3],
  ],

  [
    [6, 4, 3, 5, 2, 9, 1, 7, 8],
    [8, 9, 2, 6, 1, 7, 3, 4, 5],
    [7, 5, 1, 8, 3, 4, 9, 2, 6],
    [3, 1, 5, 4, 7, 8, 2, 6, 9],
    [9, 7, 8, 2, 6, 3, 5, 1, 4],
    [4, 2, 6, 1, 9, 5, 7, 8, 3],
    [2, 8, 4, 3, 5, 1, 6, 9, 7],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 9, 8, 2, 4, 3, 1],
  ],

  [
    [6, 4, 3, 2, 5, 9, 7, 1, 8],
    [8, 9, 2, 6, 1, 7, 3, 4, 5],
    [7, 5, 1, 8, 3, 4, 2, 9, 6],
    [3, 1, 5, 7, 2, 8, 4, 6, 9],
    [9, 7, 8, 4, 6, 1, 5, 2, 3],
    [4, 2, 6, 3, 9, 5, 1, 8, 7],
    [2, 8, 4, 9, 7, 3, 6, 5, 1],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [5, 6, 7, 1, 8, 2, 9, 3, 4],
  ],

  [
    [7, 4, 3, 6, 5, 9, 1, 2, 8],
    [8, 9, 2, 1, 3, 7, 6, 4, 5],
    [5, 6, 1, 8, 2, 4, 9, 3, 7],
    [3, 1, 5, 2, 7, 8, 4, 6, 9],
    [9, 2, 8, 4, 6, 3, 5, 7, 1],
    [4, 7, 6, 5, 9, 1, 2, 8, 3],
    [2, 8, 4, 3, 1, 5, 7, 9, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [6, 5, 7, 9, 8, 2, 3, 1, 4],
  ],

  [
    [6, 4, 3, 1, 5, 9, 7, 2, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [7, 5, 1, 8, 2, 4, 6, 9, 3],
    [4, 1, 5, 3, 7, 8, 2, 6, 9],
    [9, 2, 8, 4, 6, 1, 5, 3, 7],
    [3, 7, 6, 2, 9, 5, 4, 8, 1],
    [2, 8, 4, 7, 1, 3, 9, 5, 6],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [5, 6, 7, 9, 8, 2, 3, 1, 4],
  ],

  [
    [7, 4, 3, 1, 5, 9, 6, 2, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [6, 5, 1, 8, 2, 4, 3, 9, 7],
    [4, 1, 5, 3, 7, 8, 2, 6, 9],
    [9, 2, 8, 4, 6, 5, 7, 3, 1],
    [3, 7, 6, 2, 9, 1, 5, 8, 4],
    [2, 8, 4, 5, 1, 3, 9, 7, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 9, 8, 2, 4, 1, 3],
  ],

  [
    [6, 4, 3, 5, 1, 9, 7, 2, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [7, 5, 1, 8, 2, 4, 3, 9, 6],
    [3, 1, 5, 4, 7, 8, 2, 6, 9],
    [9, 7, 8, 2, 6, 5, 4, 3, 1],
    [4, 2, 6, 1, 9, 3, 5, 8, 7],
    [2, 8, 4, 9, 5, 1, 6, 7, 3],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 3, 8, 2, 9, 1, 4],
  ],

  [
    [7, 4, 3, 5, 1, 9, 2, 6, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [6, 5, 1, 8, 2, 4, 3, 9, 7],
    [3, 1, 5, 4, 7, 8, 6, 2, 9],
    [9, 7, 8, 2, 6, 1, 4, 5, 3],
    [4, 2, 6, 3, 9, 5, 7, 8, 1],
    [2, 8, 4, 1, 5, 3, 9, 7, 6],
    [5, 3, 9, 7, 4, 6, 8, 1, 2],
    [1, 6, 7, 9, 8, 2, 5, 3, 4],
  ],

  [
    [7, 4, 3, 5, 1, 9, 6, 2, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [6, 5, 1, 8, 2, 4, 7, 9, 3],
    [3, 1, 5, 4, 7, 8, 2, 6, 9],
    [9, 2, 8, 1, 6, 5, 4, 3, 7],
    [4, 7, 6, 2, 9, 3, 5, 8, 1],
    [2, 8, 4, 9, 5, 1, 3, 7, 6],
    [5, 3, 9, 7, 4, 6, 8, 1, 2],
    [1, 6, 7, 3, 8, 2, 9, 5, 4],
  ],

  [
    [7, 4, 3, 5, 1, 9, 6, 2, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [6, 5, 1, 8, 2, 4, 9, 3, 7],
    [3, 1, 5, 4, 7, 8, 2, 6, 9],
    [9, 2, 8, 1, 6, 5, 4, 7, 3],
    [4, 7, 6, 2, 9, 3, 5, 8, 1],
    [2, 8, 4, 3, 5, 1, 7, 9, 6],
    [1, 3, 9, 7, 4, 6, 8, 5, 2],
    [5, 6, 7, 9, 8, 2, 3, 1, 4],
  ],

  [
    [5, 4, 3, 1, 2, 9, 7, 6, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [7, 6, 1, 8, 5, 4, 2, 9, 3],
    [4, 1, 5, 3, 7, 8, 6, 2, 9],
    [9, 7, 8, 2, 6, 5, 3, 1, 4],
    [3, 2, 6, 4, 9, 1, 5, 8, 7],
    [2, 8, 4, 7, 1, 3, 9, 5, 6],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [6, 5, 7, 9, 8, 2, 4, 3, 1],
  ],

  [
    [5, 4, 3, 2, 1, 9, 7, 6, 8],
    [8, 9, 2, 6, 3, 7, 1, 4, 5],
    [7, 6, 1, 8, 5, 4, 9, 2, 3],
    [4, 1, 5, 7, 2, 8, 6, 3, 9],
    [9, 2, 8, 3, 6, 1, 4, 5, 7],
    [3, 7, 6, 4, 9, 5, 2, 8, 1],
    [2, 8, 4, 1, 7, 3, 5, 9, 6],
    [1, 3, 9, 5, 4, 6, 8, 7, 2],
    [6, 5, 7, 9, 8, 2, 3, 1, 4],
  ],
];

export function generateRandomGrid(emptyNumberNeeded :number){

  const randomGrid = _.cloneDeep(ALL_THE_SOLUTIONS[randomIntFromInterval(0,ALL_THE_SOLUTIONS.length)])

  generateGrid(randomGrid,emptyNumberNeeded)
  
  return randomGrid;
}