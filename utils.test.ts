import {
    decimalToBinary,
    decimalSetHasNumber,
    binarySetToDecimalSet,
    decimalNumberToBinarySet,
    addDecimalNumberToDecimalSet,
    getMissingBinarySetFromBinarySet,
    decimalSetToNumbersList,
    getRowsSetsFromGrid,
    getColumnsSetsFromGrid,
    getSquaresSetsFromGrid,
    specificColumnHasNumber,
    specificRowHasNumber,
    specificSquareHasNumber,
    mergeDecimalSets,
    getSetsForSpotOnGrid,
    displayGrid,
    bestSpotWithFewerPossibility,
    resolve,
} from './utils';

test('decimalToBinary(256) to equals 100000000', () => {
    expect(decimalToBinary(256)).toBe('100000000');
});

test('decimalToBinary(1) to equals 00000001', () => {
    expect(decimalToBinary(1)).toBe('000000001');
});

test('setHasNumber(256,9) to be true', () => {
    expect(decimalSetHasNumber(256, 9)).toBe(true);
});

test('setHasNumber(1,9) to be false', () => {
    expect(decimalSetHasNumber(1, 9)).toBe(false);
});

test('binarySetToDecimalSet("000000001") to equal 1', () => {
    expect(binarySetToDecimalSet('000000001')).toBe(1);
});

test('binarySetToDecimalSet("111110111") to equal 503', () => {
    expect(binarySetToDecimalSet('111110111')).toBe(503);
});

test('decimalNumberToBinarySet :  9 => 256 ', () => {
    expect(decimalNumberToBinarySet(9)).toBe(256);
});

const binarySet = '111110111'; // <= has 9,8,7,6,5,3,2,1, 4 is missing

test('decimalSetHasNumber :  111110111 & 4 to be false', () => {
    expect(decimalSetHasNumber(binarySetToDecimalSet(binarySet), 4)).toBe(
        false,
    );
});

test('decimalSetHasNumber :  111110111 & 7 to be true', () => {
    expect(decimalSetHasNumber(binarySetToDecimalSet(binarySet), 7)).toBe(true);
});

test('decimalSetHasNumber :  000000000 & 7 to be false', () => {
    expect(decimalSetHasNumber(binarySetToDecimalSet('000000000'), 7)).toBe(
        false,
    );
});

const emptyBinarySet = '00000000';

test('addDecimalNumberToDecimalSet(00000000,1) => 000000001', () => {
    expect(
        addDecimalNumberToDecimalSet(binarySetToDecimalSet('00000000'), 1),
    ).toBe(binarySetToDecimalSet('000000001'));
});

test('getMissingBinarySetFromBinarySet(00000000) => 111111111', () => {
    expect(
        getMissingBinarySetFromBinarySet(binarySetToDecimalSet('00000000')),
    ).toBe(binarySetToDecimalSet('111111111'));
});

test('getMissingBinarySetFromBinarySet(111111111) => 0', () => {
    expect(
        getMissingBinarySetFromBinarySet(binarySetToDecimalSet('111111111')),
    ).toBe(binarySetToDecimalSet('00000000'));
});

test('decimalSetToNumbersList(111111011) => [1, 2, 4, 5, 6, 7, 8, 9]', () => {
    expect(
        decimalSetToNumbersList(binarySetToDecimalSet('111111011')),
    ).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
});

test('decimalSetToNumbersList(000000000) => []', () => {
    expect(decimalSetToNumbersList(binarySetToDecimalSet('000000000'))).toEqual(
        [],
    );
});

const grid = [
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 9, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 5, 0],
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 7, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2],
];

test('getRowsSetsFromGrid should equals [1,256,4,1,32,16,128,64,2]', () => {
    expect(getRowsSetsFromGrid(grid)).toEqual([
        1,
        256,
        4,
        1,
        32,
        16,
        128,
        64,
        2,
    ]);
});

test('getColumnsSetsFromGrid should equals [128,32,256,64,1,1,4,16,2]', () => {
    expect(getColumnsSetsFromGrid(grid)).toEqual([
        128,
        32,
        256,
        64,
        1,
        1,
        4,
        16,
        2,
    ]);
});

test('getSquaresSetsFromGrid should equals [256,1,4,32,1,16,128,64,2]', () => {
    expect(getSquaresSetsFromGrid(grid)).toEqual([
        256,
        1,
        4,
        32,
        1,
        16,
        128,
        64,
        2,
    ]);
});

const columnsSets = getColumnsSetsFromGrid(grid);
const rowsSets = getRowsSetsFromGrid(grid);
const squaresSets = getSquaresSetsFromGrid(grid);

test('specificColumnHasNumber(columnsSets,0,8) should equals true', () => {
    expect(specificColumnHasNumber(columnsSets, 0, 8)).toEqual(true);
});

test('specificRowHasNumber(rowsSets,8,2) should equals true', () => {
    expect(specificRowHasNumber(rowsSets, 8, 2)).toEqual(true);
});

test('specificSquareHasNumber(squaresSets,7,7) should equals true', () => {
    expect(specificSquareHasNumber(squaresSets, 7, 7)).toEqual(true);
});

let firstBinarySet = binarySetToDecimalSet('00000001');
let secondBinarySet = binarySetToDecimalSet('10000000');

test('mergeBinarySets(00000001,100000000) should equals 100000001', () => {
    expect(mergeDecimalSets(firstBinarySet, secondBinarySet)).toEqual(
        binarySetToDecimalSet('10000001'),
    );
});

test('getSetsForSpotOnGrid(4,0,columnsSets,rowsSets,squaresSets) should equals 010100000', () => {
    expect(
        getSetsForSpotOnGrid(4, 0, columnsSets, rowsSets, squaresSets),
    ).toEqual(binarySetToDecimalSet('010100000'));
});

test('Available number for spot grid[4][0] should be [1,2,3,5,7,9]', () => {
    const setsForSpotOnGrid = getSetsForSpotOnGrid(
        4,
        0,
        columnsSets,
        rowsSets,
        squaresSets,
    );

    const missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid,
    );

    expect(decimalSetToNumbersList(missingSetsForSpotOnGrid)).toEqual([
        1,
        2,
        3,
        4,
        5,
        7,
        9,
    ]);
});

test('try to add a number on first spot 0 0 ', () => {
    const grid = [
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
    ];

    displayGrid(grid);

    const i = 0;
    const j = 0;

    let columnsSets = getColumnsSetsFromGrid(grid);
    let rowsSets = getRowsSetsFromGrid(grid);
    let squaresSets = getSquaresSetsFromGrid(grid);

    let setsForSpotOnGrid = getSetsForSpotOnGrid(
        i,
        j,
        columnsSets,
        rowsSets,
        squaresSets,
    );

    let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid,
    );

    let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
        missingSetsForSpotOnGrid,
    );

    expect(listOfPossibilityForSpecificSpot).toEqual([2, 3, 4, 5, 6, 7]);

    grid[i][j] = listOfPossibilityForSpecificSpot[0];

    displayGrid(grid);

    columnsSets = getColumnsSetsFromGrid(grid);
    rowsSets = getRowsSetsFromGrid(grid);
    squaresSets = getSquaresSetsFromGrid(grid);

    setsForSpotOnGrid = getSetsForSpotOnGrid(
        i,
        j,
        columnsSets,
        rowsSets,
        squaresSets,
    );

    missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid,
    );

    listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
        missingSetsForSpotOnGrid,
    );

    expect(listOfPossibilityForSpecificSpot).toEqual([3, 4, 5, 6, 7]);
});

console.log('=========================================================');

test('try to add a number on first 3 spots', () => {
    const grid = [
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
    ];

    const i = 0;

    for (let j = 0; j < 3; j++) {
        if (grid[i][j] !== 0) continue;

        let columnsSets = getColumnsSetsFromGrid(grid);
        let rowsSets = getRowsSetsFromGrid(grid);
        let squaresSets = getSquaresSetsFromGrid(grid);

        let setsForSpotOnGrid = getSetsForSpotOnGrid(
            i,
            j,
            columnsSets,
            rowsSets,
            squaresSets,
        );

        let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
            setsForSpotOnGrid,
        );

        let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
            missingSetsForSpotOnGrid,
        );

        grid[i][j] = listOfPossibilityForSpecificSpot[0];
    }
    displayGrid(grid);
});

test('try to add a number on first line ', () => {
    const grid = [
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
    ];

    const i = 0;

    for (let j = 0; j < grid.length; j++) {
        if (grid[i][j] !== 0) continue;

        let columnsSets = getColumnsSetsFromGrid(grid);
        let rowsSets = getRowsSetsFromGrid(grid);
        let squaresSets = getSquaresSetsFromGrid(grid);

        let setsForSpotOnGrid = getSetsForSpotOnGrid(
            i,
            j,
            columnsSets,
            rowsSets,
            squaresSets,
        );

        let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
            setsForSpotOnGrid,
        );

        let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
            missingSetsForSpotOnGrid,
        );

        grid[i][j] = listOfPossibilityForSpecificSpot[0];
    }
    displayGrid(grid);
});

test('find best Spot With Fewer Possibility', () => {
    const grid = [
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
    ];
    expect(bestSpotWithFewerPossibility(grid)).toEqual([0, 0]);
});

test('find best Spot With Fewer Possibility', () => {
    const grid = [
        [9, 2, 6, 5, 7, 1, 4, 8, 3],
        [3, 5, 1, 4, 8, 6, 2, 7, 9],
        [8, 7, 4, 9, 2, 3, 5, 1, 6],
        [5, 8, 2, 3, 6, 7, 1, 9, 4],
        [1, 4, 9, 2, 5, 8, 3, 6, 7],
        [7, 6, 3, 1, 0, 0, 8, 2, 5],
        [2, 3, 8, 7, 0, 0, 6, 5, 1],
        [6, 1, 7, 8, 3, 5, 9, 4, 2],
        [4, 9, 5, 6, 1, 2, 7, 3, 8],
    ];
    expect(bestSpotWithFewerPossibility(grid)).toEqual([5, 4]);
});

test('resolve', () => {
    const grid = [
        [0, 0, 0, 6, 0, 0, 0, 2, 0],
        [8, 0, 1, 0, 0, 7, 9, 0, 0],
        [0, 0, 0, 0, 0, 4, 1, 0, 0],
        [0, 0, 5, 0, 0, 8, 0, 0, 0],
        [0, 2, 8, 5, 6, 0, 4, 0, 3],
        [0, 0, 0, 0, 0, 0, 0, 8, 0],
        [0, 0, 0, 0, 9, 0, 0, 0, 7],
        [0, 0, 0, 7, 0, 0, 0, 1, 0],
        [1, 5, 0, 0, 0, 0, 0, 0, 4],
    ];

    resolve(grid);
});
