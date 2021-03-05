export function decimalToBinary(decimalNumber: number) {
    return decimalNumber.toString(2).padStart(9, '0');
}

export function binarySetToDecimalSet(binaryNumber: string) {
    return parseInt(binaryNumber, 2);
}

export function decimalSetHasNumber(decimalSet: number, number) {
    let binarySet = decimalNumberToBinarySet(number);
    return (decimalSet & binarySet) === binarySet;
}

export function decimalNumberToBinarySet(decimalNumber: number) {
    return 1 << (decimalNumber - 1);
}

export function addDecimalNumberToDecimalSet(
    decimalSet: number,
    decimalNumber: number,
) {
    return decimalSet | decimalNumberToBinarySet(decimalNumber);
}

export function getMissingBinarySetFromBinarySet(binarySet: number) {
    return binarySetToDecimalSet('111111111') & ~binarySet;
}

export function decimalSetToNumbersList(decimalSet: number) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => {
        if (decimalSetHasNumber(decimalSet, number)) {
            return number;
        }
    });
}

export function getRowsSetsFromGrid(grid) {
    let rowsSets = [];

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

export function getColumnsSetsFromGrid(grid) {
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

export function getSquaresSetsFromGrid(grid) {
    let squaresSet = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let squaresSetIndice = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            let number = grid[i][j];
            squaresSetIndice = Math.floor(j / 3) + Math.floor(i / 3) * 3;

            if (number !== 0) {
                squaresSet[squaresSetIndice] = addDecimalNumberToDecimalSet(
                    squaresSet[squaresSetIndice],
                    number,
                );
            }
        }
    }

    return squaresSet;
}

export function specificColumnHasNumber(
    columnsSets,
    columnNumber: number,
    decimalNumber: number,
) {
    return decimalSetHasNumber(columnsSets[columnNumber], decimalNumber);
}

export function specificRowHasNumber(
    rowsSets,
    rowNumber: number,
    decimalNumber: number,
) {
    return decimalSetHasNumber(rowsSets[rowNumber], decimalNumber);
}

export function specificSquareHasNumber(
    squareSets,
    squareNumber: number,
    decimalNumber: number,
) {
    return decimalSetHasNumber(squareSets[squareNumber], decimalNumber);
}

export function mergeDecimalSets(
    firstDecimalSets: number,
    secondDecimalSets: number,
) {
    return firstDecimalSets | secondDecimalSets;
}

export function getSetsForSpotOnGrid(
    row,
    column,
    columnsSets,
    rowsSets,
    squaresSets,
) {
    let squaresSetIndice = Math.floor(column / 3) + Math.floor(row / 3) * 3;

    const squaresSet = squaresSets[squaresSetIndice];
    const rowSet = rowsSets[row];
    const columnSet = columnsSets[column];

    return mergeDecimalSets(mergeDecimalSets(squaresSet, rowSet), columnSet);
}
