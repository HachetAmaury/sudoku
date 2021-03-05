12:12 : create project on github : https://github.com/HachetAmaury/sudoku

12:13 : clone project

```bash
git clone https://github.com/HachetAmaury/sudoku
```

12:14 : create package.json :

```bash
yarn init
```

12:14 : add .prettierrc

```json
{
    "tabWidth": 4,
    "singleQuote": true,
    "trailingComma": "all"
}
```

12:15 : add typescript

```bash
yarn add typescript
```

12:15 : add .eslintrc

```json
{
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "extends": ["plugin:@typescript-eslint/recommended"],
    "rules": {}
}
```

12:15 : add .eslintignore

```
node_modules
.vscode
.git
```

12:16 : add Jest

```bash
yarn add --dev jest
```

Add the jest command to package.json

```json
{
    "scripts": {
        "test": "jest"
    }
}
```

12:24 : create sum.test.ts to test Jest

```javascript
function sum(a, b) {
    return a + b;
}
module.exports = sum;
```

12:25 : execute jest

```
yarn test
```

```
 FAIL  ./sum.test.ts
  ● Test suite failed to run

    Your test suite must contain at least one test.

      at onResult (node_modules/@jest/core/build/TestScheduler.js:175:18)
      at node_modules/@jest/core/build/TestScheduler.js:304:17
      at node_modules/emittery/index.js:260:13
          at Array.map (<anonymous>)
      at Emittery.Typed.emit (node_modules/emittery/index.js:258:23)
```

Is it because sum.test.ts has a ".ts" extension and by default Jest only search for ".js" ?

Add jest.config.js file :

```
module.exports = {
    verbose: true,
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
    transformIgnorePatterns: ['/node_modules/'],
};
```

12:30 : Re read https://jestjs.io/docs/en/getting-started .... I mixed sum.ts and sum.test.ts file ^^

creating sum.ts file :

```javascript
function sum(a, b) {
    return a + b;
}
module.exports = sum;
```

changing sum.test.ts to :

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
```

12:34 : install @types/jest and @types/mocha

```bash
yarn add --dev @types/jest @types/mocha
```

12:36 : Vscode ERROR

sum.test.ts :

```
Cannot redeclare block-scoped variable 'sum'.ts(2451)
sum.ts(1, 10): 'sum' was also declared here.
```

sum.ts :

```
Cannot redeclare block-scoped variable 'sum'.ts(2451)
sum.test.ts(1, 7): 'sum' was also declared here.
```

.... WTF ?!

Types script doesn't like module.exper & require ??

12:43 : Change to import syntaxe

sum.ts :

```javascript
function sum(a, b) {
    return a + b;
}
export default sum;
```

sum.test.ts :

```javascript
import sum from './sum';

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
```

12:45 : execute jest

```
yarn test
```

ERROR

```
 FAIL  ./sum.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.

    By default, if Jest sees a Babel config, it will use that to transform your files, ignoring "node_modules".

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/en/ecmascript-modules for how to enable it.
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/en/configuration.html

    Details:

    /Users/amaury/Documents/AE/sudoku/sum.test.ts:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import sum from './sum';
                                                                                             ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1350:14)
```

Jest doesn't like "import" ??!!

12:49 : Jest doesn't like Typescript ?! https://github.com/kulshekhar/ts-jest

install ts-jest :

```bash
yarn add --dev ts-jest
```

config ts-jest :

```
yarn ts-jest config:init
```

ERROR :

```
ts-jest[cli] (FATAL) Configuration file jest.config.js already exists.
error Command failed with exit code 1.
```

remove jest.config.js & retry

```
yarn ts-jest config:init
```

Retry to launch test :

```
yarn jest
```

IT WORKS !!!!

```bash
PASS  ./sum.test.ts
  ✓ adds 1 + 2 to equal 3 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.516 s
Ran all test suites.
✨  Done in 2.28s.
```

12:55 : OK after 45 min the environnment setup is over ^^

The goal of this progect is to have a sudoku solver, I will first write the algorithm using TDD then plug the UI.

The algorithm will use binary to store the numbers set :

```
000000001 => contains only 1
000000010 => contains only 2
000000100 => contains only 3
000001000 => contains only 4
000010000 => contains only 5
000100000 => contains only 6
001000000 => contains only 7
010000000 => contains only 8
100000000 => contains only 9
```

The sets are then converted to decimal

```
000000000 => contains nothing => 0
000000001 => contains only 1 => 1
000000010 => contains only 2 => 2
000000100 => contains only 3 => 4
000001000 => contains only 4 => 8
000010000 => contains only 5 => 16
000100000 => contains only 6 => 32
001000000 => contains only 7 => 64
010000000 => contains only 8 => 128
100000000 => contains only 9 => 256
```

To get a grid as an array of numbers :

-   Rows

```
 -----------------------
| 0 0 0 | 0 0 1 | 0 0 0 |  <=== this Row has only a 1 => binary : 000000001 => decimal : 1
| 0 0 9 | 0 0 0 | 0 0 0 |  <=== this Row has only a 9 => binary : 100000000 => decimal : 256
| 0 0 0 | 0 0 0 | 3 0 0 |  <=== this Row has only a 3 => binary : 000000100 => decimal : 4
 -----------------------
| 0 0 0 | 0 1 0 | 0 0 0 |  <=== this Row has only a 1 => binary : 000000001 => decimal : 1
| 0 6 0 | 0 0 0 | 0 0 0 |  <=== this Row has only a 6 => binary : 000100000 => decimal : 32
| 0 0 0 | 0 0 0 | 0 5 0 |  <=== this Row has only a 5 => binary : 000010000 => decimal : 16
 -----------------------
| 8 0 0 | 0 0 0 | 0 0 0 |  <=== this Row has only a 8 => binary : 010000000 => decimal : 128
| 0 0 0 | 7 0 0 | 0 0 0 |  <=== this Row has only a 7 => binary : 001000000 => decimal : 64
| 0 0 0 | 0 0 0 | 0 0 2 |  <=== this Row has only a 2 => binary : 000000010 => decimal : 2
 -----------------------
```

So all the Rows sets for this grid can be stored to an array :

```javascript
[1, 256, 4, 1, 32, 16, 128, 64, 2];
```

-   Columns

```
 -----------------------
| 0 0 0 | 0 0 1 | 0 0 0 |
| 0 0 9 | 0 0 0 | 0 0 0 |
| 0 0 0 | 0 0 0 | 3 0 0 |
 -----------------------
| 0 0 0 | 0 1 0 | 0 0 0 |
| 0 6 0 | 0 0 0 | 0 0 0 |
| 0 0 0 | 0 0 0 | 0 5 0 |
 -----------------------
| 8 0 0 | 0 0 0 | 0 0 0 |
| 0 0 0 | 7 0 0 | 0 0 0 |
| 0 0 0 | 0 0 0 | 0 0 2 |
 -----------------------

 - column 1 : contains 8 : binary 010000000  => decimal 128
 - column 2 : contains 6 : binary 000100000  => decimal 32
 - column 3 : contains 9 : binary 100000000  => decimal 256
 - column 4 : contains 7 : binary 001000000  => decimal 64
 - column 5 : contains 1 : binary 000000001  => decimal 1
 - column 6 : contains 1 : binary 000000001  => decimal 1
 - column 7 : contains 3 : binary 000000100  => decimal 4
 - column 8 : contains 5 : binary 000010000  => decimal 16
 - column 9 : contains 2 : binary 000000010  => decimal 2

```

So all the columns sets for this grid can be stored to an array :

```javascript
[0, 32, 256, 64, 1, 1, 4, 16, 2];
```

-   Squares

```
 -----------------------
| 0 0 0 | 0 0 1 | 0 0 0 |
| 0 0 9 | 0 0 0 | 0 0 0 |
| 0 0 0 | 0 0 0 | 3 0 0 |
 -----------------------
| 0 0 0 | 0 1 0 | 0 0 0 |
| 0 6 0 | 0 0 0 | 0 0 0 |
| 0 0 0 | 0 0 0 | 0 5 0 |
 -----------------------
| 8 0 0 | 0 0 0 | 0 0 0 |
| 0 0 0 | 7 0 0 | 0 0 0 |
| 0 0 0 | 0 0 0 | 0 0 2 |
 -----------------------

    from left to right & up to down  :

 - square 1 : contains 9 : binary 100000000  => decimal 256
 - square 2 : contains 1 : binary 000000001  => decimal 1
 - square 3 : contains 3 : binary 000000100  => decimal 4

 - square 4 : contains 6 : binary 000100000  => decimal 32
 - square 5 : contains 1 : binary 000000001  => decimal 1
 - square 6 : contains 5 : binary 000010000  => decimal 16

 - square 7 : contains 8 : binary 000000000  => decimal 128
 - square 8 : contains 7 : binary 001000000  => decimal 64
 - square 9 : contains 2 : binary 000000010  => decimal 2
```

So all the squares sets for this grid can be stored to an array :

```javascript
[256, 1, 4, 32, 1, 16, 128, 64, 2];
```

==> Of course this only stores the numbers not where they are in the columns / Rows / squares

The grid will be stored as a 2 dimensions array :

```javascript
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
```

We need to develop those methods :

-   decimalToBinary(decimalNumber)
-   binaryToDecimal(binaryNumber)
-   setHasNumber(set, decimalNumber)
-   addNumberToSet(set,decimalNumber)
-   specificColumnHasNumber(columnNumber, decimalNumber)
-   specificRowHasNumber(RowNumber, decimalNumber)
-   specificSquareHasNumber(squareNumber, decimalNumber)

13:42 : develop decimalToBinary(decimalNumber)

Create util.ts and utils.test.ts :

13:55 :

```javascript
export function decimalToBinary(decimalNumber: number) {
    return decimalNumber.toString(2).padStart(9, '0');
}
```

```javascript
import { decimalToBinary } from './utils';

test('decimalToBinary(256) to equals 100000000', () => {
    expect(decimalToBinary(256)).toBe('100000000');
});

test('decimalToBinary(1) to equals 00000001', () => {
    expect(decimalToBinary(1)).toBe('000000001');
});
```

13:56 : setHasNumber(set, decimalNumber)

```javascript
export function setHasNumber(set: number, number) {
    return (set & number) === number;
}
```

14:18 : binaryToDecimal(binaryNumber)

```javascript
export function binaryToDecimal(binaryNumber: string) {
    return parseInt(binaryNumber, 2);
}
```

```javascript
test('binaryToDecimal("000000001") to equal 1', () => {
    expect(binaryToDecimal('000000001')).toBe(1);
});

test('binaryToDecimal("111110111") to equal 503', () => {
    expect(binaryToDecimal('111110111')).toBe(503);
});
```

14:21 back to setHasNumber testing :

14:26 :

renaming binaryToDecimal => binarySetToDecimalSet
renaming setHasNumber => binarySetHasNumber

14:38 : decimalNumberToBinarySet

```javascript
export function decimalNumberToBinarySet(decimalNumber: number) {
    return 1 << (decimalNumber - 1);
}
```

```javascript
test('decimalNumberToBinarySet :  9 => 256 ', () => {
    expect(decimalNumberToBinarySet(9)).toBe(256);
});
```

14:40 back to binarySetHasNumber testing :

```javascript
const binarySet = '111110111'; // <= has 9,8,7,6,5,3,2,1, 4 is missing

test('binarySetHasNumber :  111110111 & 4 to be false', () => {
    expect(
        binarySetHasNumber(
            binarySetToDecimalSet(binarySet),
            decimalNumberToBinarySet(4),
        ),
    ).toBe(false);
});

test('binarySetHasNumber :  111110111 & 7 to be true', () => {
    expect(
        binarySetHasNumber(
            binarySetToDecimalSet(binarySet),
            decimalNumberToBinarySet(7),
        ),
    ).toBe(true);
});
```

14:42 : addDecimalNumberToDecimalSet(decimalSet,decimalNumber)

```javascript
export function addDecimalNumberToDecimalSet(
    decimalSet: number,
    decimalNumber: number,
) {
    return decimalSet | decimalNumberToBinarySet(decimalNumber);
}
```

```javascript
const emptyBinarySet = '00000000';

test('addDecimalNumberToDecimalSet(00000000,1) => 000000001', () => {
    expect(
        addDecimalNumberToDecimalSet(binarySetToDecimalSet(emptyBinarySet), 1),
    ).toBe(binarySetToDecimalSet('000000001'));
});
```

15:00 PAUSE

15:36 : GO

getMissingBinarySetFromeBinarySet(binarySet)

```javascript
export function getMissingBinarySetFromBinarySet(binarySet: number) {
    return binarySetToDecimalSet('111111111') & ~binarySet;
}
```

```javascript
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
```

16:29 : popNumberFromBinarySet(binarySet: number)

16:46 :

```javascript
export function binarySetToNumbersList(binarySet: number) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => {
        if (binarySetHasNumber(binarySet, number)) {
            return number;
        }
    });
}
```

```javascript
test('binarySetToNumbersList(111111111) => [1, 2, 3, 4, 5, 6, 7, 8, 9]', () => {
    expect(binarySetToNumbersList(binarySetToDecimalSet('111111111'))).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
    ]);
});

test('binarySetToNumbersList(000000000) => []', () => {
    expect(binarySetToNumbersList(binarySetToDecimalSet('000000000'))).toEqual(
        [],
    );
});
```

16:48 : Time to develop the method to acces the Sudoku grid :

-   specificColumnHasNumber(columnNumber, decimalNumber)
-   specificRowHasNumber(RowNumber, decimalNumber)
-   specificSquareHasNumber(squareNumber, decimalNumber)

16:51 It seems that some other functions are needed first to transform the grid into the different arrays

17:16 : getRowsSetsFromGrid(grid)

```javascript
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
```

```javascript
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
```

getColumnsSetsFromGrid(grid)

```javascript
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
```

```javascript
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
```

17:18 : Now : getSquaresSetsFromGrid(grid)

17:52 :

```javascript
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
```

```javascript
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
```

17:56 : Ok, we can now go back to :

-   specificColumnHasNumber(columnNumber, decimalNumber)
-   specificRowHasNumber(RowNumber, decimalNumber)
-   specificSquareHasNumber(squareNumber, decimalNumber)

18:07 :

```javascript
export function specificColumnHasNumber(
    columnsSets,
    columnNumber: number,
    decimalNumber: number,
) {
    return binarySetHasNumber(
        columnsSets[columnNumber],
        decimalNumberToBinarySet(decimalNumber),
    );
}
```

```javascript
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

const columnsSets = getColumnsSetsFromGrid(grid);

test('specificColumnHasNumber(columnsSets,0,8) should equals true', () => {
    expect(specificColumnHasNumber(columnsSets, 0, 8)).toEqual(true);
});
```

18:11 :

```javascript
export function specificRowHasNumber(
    rowsSets,
    rowNumber: number,
    decimalNumber: number,
) {
    return binarySetHasNumber(
        rowsSets[rowNumber],
        decimalNumberToBinarySet(decimalNumber),
    );
}
```

```javascript
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

const rowsSets = getRowsSetsFromGrid(grid);

test('specificColumnHasNumber(columnsSets,0,8) should equals true', () => {
    expect(specificColumnHasNumber(columnsSets, 0, 8)).toEqual(true);
});
```

18:15 :

```javascript
export function specificSquareHasNumber(
    squareSets,
    squareNumber: number,
    decimalNumber: number,
) {
    return binarySetHasNumber(
        squareSets[squareNumber],
        decimalNumberToBinarySet(decimalNumber),
    );
}
```

```javascript
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

const squaresSets = getSquaresSetsFromGrid(grid);

test('specificSquareHasNumber(squaresSets,7,7) should equals true', () => {
    expect(specificSquareHasNumber(squaresSets, 7, 7)).toEqual(true);
});
```

18:18 : Now it's time to get the sets for a specific spot on the grid

First what we need is a method to merge multiple sets

18:29 :

```javascript
export function mergeDecimalSets(
    firstDecimalSets: number,
    secondDecimalSets: number,
) {
    return firstDecimalSets | secondDecimalSets;
}
```

```javascript
let firstBinarySet = binarySetToDecimalSet('00000001');
let secondBinarySet = binarySetToDecimalSet('10000000');

test('mergeBinarySets(00000001,100000000) should equals 100000001', () => {
    expect(mergeDecimalSets(firstBinarySet, secondBinarySet)).toEqual(
        binarySetToDecimalSet('10000001'),
    );
});
```

Now that we can merges sets we can retriev the tree set for a specific spot on a grid and merge the sets

18:42

```javascript
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
```

```javascript
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

const columnsSets = getColumnsSetsFromGrid(grid);
const rowsSets = getRowsSetsFromGrid(grid);
const squaresSets = getSquaresSetsFromGrid(grid);

test('getSetsForSpotOnGrid(4,0,columnsSets,rowsSets,squaresSets) should equals 010100000', () => {
    expect(
        getSetsForSpotOnGrid(4, 0, columnsSets, rowsSets, squaresSets),
    ).toEqual(binarySetToDecimalSet('010100000'));
});
```

Now to get the number available for this spot all we have to do is use getMissingBinarySetFromBinarySet

18:53 : It seems that binarySetToNumbersList doesn' t work correctly

19:28 : I chnaged somes names in the code, I found the error, I mixed the binary and decimal set so I was passing 8 to test if the number 8 was present but the function was expecting a number representing a set not a value I added decimalNumberToBinarySet() ti fix it.

I can now get a set of possible value for a specific spot :

```javascript
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

const columnsSets = getColumnsSetsFromGrid(grid);
const rowsSets = getRowsSetsFromGrid(grid);
const squaresSets = getSquaresSetsFromGrid(grid);

test('Available number for spot grid[4][0] should be  [1,2,3,5,7,9]', () => {
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
```

19:34 : Ok now it's time to test all together

Let's first make a function to display the grid

But let's first push the code

... .gitignore is missing ^^

create .gitignore :

```
.DS_Store
node_modules
.vscode
```

Let's also create a CHANGELOG

```
## [1.0.0] - 2021-03-05 - RELEASE

## Added

-   decimalToBinary
-   decimalSetHasNumber
-   binarySetToDecimalSet
-   decimalNumberToBinarySet
-   addDecimalNumberToDecimalSet
-   getMissingBinarySetFromBinarySet
-   decimalSetToNumbersList
-   getRowsSetsFromGrid
-   getColumnsSetsFromGrid
-   getSquaresSetsFromGrid
-   specificColumnHasNumber
-   specificRowHasNumber
-   specificSquareHasNumber
-   mergeDecimalSets
-   getSetsForSpotOnGrid
```
