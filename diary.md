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
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
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
import sum from "./sum";

test("adds 1 + 2 to equal 3", () => {
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

- Rows

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

- Columns

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

- Squares

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

- decimalToBinary(decimalNumber)
- binaryToDecimal(binaryNumber)
- setHasNumber(set, decimalNumber)
- addNumberToSet(set,decimalNumber)
- specificColumnHasNumber(columnNumber, decimalNumber)
- specificRowHasNumber(RowNumber, decimalNumber)
- specificSquareHasNumber(squareNumber, decimalNumber)

13:42 : develop decimalToBinary(decimalNumber)

Create util.ts and utils.test.ts :

13:55 :

```javascript
export function decimalToBinary(decimalNumber: number) {
  return decimalNumber.toString(2).padStart(9, "0");
}
```

```javascript
import { decimalToBinary } from "./utils";

test("decimalToBinary(256) to equals 100000000", () => {
  expect(decimalToBinary(256)).toBe("100000000");
});

test("decimalToBinary(1) to equals 00000001", () => {
  expect(decimalToBinary(1)).toBe("000000001");
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
  expect(binaryToDecimal("000000001")).toBe(1);
});

test('binaryToDecimal("111110111") to equal 503', () => {
  expect(binaryToDecimal("111110111")).toBe(503);
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
test("decimalNumberToBinarySet :  9 => 256 ", () => {
  expect(decimalNumberToBinarySet(9)).toBe(256);
});
```

14:40 back to binarySetHasNumber testing :

```javascript
const binarySet = "111110111"; // <= has 9,8,7,6,5,3,2,1, 4 is missing

test("binarySetHasNumber :  111110111 & 4 to be false", () => {
  expect(
    binarySetHasNumber(
      binarySetToDecimalSet(binarySet),
      decimalNumberToBinarySet(4)
    )
  ).toBe(false);
});

test("binarySetHasNumber :  111110111 & 7 to be true", () => {
  expect(
    binarySetHasNumber(
      binarySetToDecimalSet(binarySet),
      decimalNumberToBinarySet(7)
    )
  ).toBe(true);
});
```

14:42 : addDecimalNumberToDecimalSet(decimalSet,decimalNumber)

```javascript
export function addDecimalNumberToDecimalSet(
  decimalSet: number,
  decimalNumber: number
) {
  return decimalSet | decimalNumberToBinarySet(decimalNumber);
}
```

```javascript
const emptyBinarySet = "00000000";

test("addDecimalNumberToDecimalSet(00000000,1) => 000000001", () => {
  expect(
    addDecimalNumberToDecimalSet(binarySetToDecimalSet(emptyBinarySet), 1)
  ).toBe(binarySetToDecimalSet("000000001"));
});
```

15:00 PAUSE

15:36 : GO

getMissingBinarySetFromeBinarySet(binarySet)

```javascript
export function getMissingBinarySetFromBinarySet(binarySet: number) {
  return binarySetToDecimalSet("111111111") & ~binarySet;
}
```

```javascript
test("getMissingBinarySetFromBinarySet(00000000) => 111111111", () => {
  expect(
    getMissingBinarySetFromBinarySet(binarySetToDecimalSet("00000000"))
  ).toBe(binarySetToDecimalSet("111111111"));
});

test("getMissingBinarySetFromBinarySet(111111111) => 0", () => {
  expect(
    getMissingBinarySetFromBinarySet(binarySetToDecimalSet("111111111"))
  ).toBe(binarySetToDecimalSet("00000000"));
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
test("binarySetToNumbersList(111111111) => [1, 2, 3, 4, 5, 6, 7, 8, 9]", () => {
  expect(binarySetToNumbersList(binarySetToDecimalSet("111111111"))).toEqual([
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

test("binarySetToNumbersList(000000000) => []", () => {
  expect(binarySetToNumbersList(binarySetToDecimalSet("000000000"))).toEqual(
    []
  );
});
```

16:48 : Time to develop the method to acces the Sudoku grid :

- specificColumnHasNumber(columnNumber, decimalNumber)
- specificRowHasNumber(RowNumber, decimalNumber)
- specificSquareHasNumber(squareNumber, decimalNumber)

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

test("getRowsSetsFromGrid should equals [1,256,4,1,32,16,128,64,2]", () => {
  expect(getRowsSetsFromGrid(grid)).toEqual([1, 256, 4, 1, 32, 16, 128, 64, 2]);
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

test("getColumnsSetsFromGrid should equals [128,32,256,64,1,1,4,16,2]", () => {
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
          number
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

test("getSquaresSetsFromGrid should equals [256,1,4,32,1,16,128,64,2]", () => {
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

- specificColumnHasNumber(columnNumber, decimalNumber)
- specificRowHasNumber(RowNumber, decimalNumber)
- specificSquareHasNumber(squareNumber, decimalNumber)

18:07 :

```javascript
export function specificColumnHasNumber(
  columnsSets,
  columnNumber: number,
  decimalNumber: number
) {
  return binarySetHasNumber(
    columnsSets[columnNumber],
    decimalNumberToBinarySet(decimalNumber)
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

test("specificColumnHasNumber(columnsSets,0,8) should equals true", () => {
  expect(specificColumnHasNumber(columnsSets, 0, 8)).toEqual(true);
});
```

18:11 :

```javascript
export function specificRowHasNumber(
  rowsSets,
  rowNumber: number,
  decimalNumber: number
) {
  return binarySetHasNumber(
    rowsSets[rowNumber],
    decimalNumberToBinarySet(decimalNumber)
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

test("specificColumnHasNumber(columnsSets,0,8) should equals true", () => {
  expect(specificColumnHasNumber(columnsSets, 0, 8)).toEqual(true);
});
```

18:15 :

```javascript
export function specificSquareHasNumber(
  squareSets,
  squareNumber: number,
  decimalNumber: number
) {
  return binarySetHasNumber(
    squareSets[squareNumber],
    decimalNumberToBinarySet(decimalNumber)
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

test("specificSquareHasNumber(squaresSets,7,7) should equals true", () => {
  expect(specificSquareHasNumber(squaresSets, 7, 7)).toEqual(true);
});
```

18:18 : Now it's time to get the sets for a specific spot on the grid

First what we need is a method to merge multiple sets

18:29 :

```javascript
export function mergeDecimalSets(
  firstDecimalSets: number,
  secondDecimalSets: number
) {
  return firstDecimalSets | secondDecimalSets;
}
```

```javascript
let firstBinarySet = binarySetToDecimalSet("00000001");
let secondBinarySet = binarySetToDecimalSet("10000000");

test("mergeBinarySets(00000001,100000000) should equals 100000001", () => {
  expect(mergeDecimalSets(firstBinarySet, secondBinarySet)).toEqual(
    binarySetToDecimalSet("10000001")
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
  squaresSets
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

test("getSetsForSpotOnGrid(4,0,columnsSets,rowsSets,squaresSets) should equals 010100000", () => {
  expect(
    getSetsForSpotOnGrid(4, 0, columnsSets, rowsSets, squaresSets)
  ).toEqual(binarySetToDecimalSet("010100000"));
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

test("Available number for spot grid[4][0] should be  [1,2,3,5,7,9]", () => {
  const setsForSpotOnGrid = getSetsForSpotOnGrid(
    4,
    0,
    columnsSets,
    rowsSets,
    squaresSets
  );

  const missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
    setsForSpotOnGrid
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

19:41 : OK back to display the grid

19:51 :

```javascript
export function displayGrid(grid) {
  let gridToDisplay = "";
  for (let i = 0; i < grid.length; i++) {
    if (i % 3 === 0)
      gridToDisplay += "  ----------------------------------" + "\n";

    for (let j = 0; j < grid.length; j++) {
      if (j % 3 === 0) gridToDisplay += " | ";
      gridToDisplay += ` ${grid[i][j]} `;
    }
    gridToDisplay += "| \n";
  }
  gridToDisplay += "  ----------------------------------" + "\n";

  console.log(gridToDisplay);
}
```

```
displayGrid(grid);

      ----------------------------------
     |  0  0  0  |  0  0  1  |  0  0  0 |
     |  0  0  9  |  0  0  0  |  0  0  0 |
     |  0  0  0  |  0  0  0  |  3  0  0 |
      ----------------------------------
     |  0  0  0  |  0  1  0  |  0  0  0 |
     |  0  6  0  |  0  0  0  |  0  0  0 |
     |  0  0  0  |  0  0  0  |  0  5  0 |
      ----------------------------------
     |  8  0  0  |  0  0  0  |  0  0  0 |
     |  0  0  0  |  7  0  0  |  0  0  0 |
     |  0  0  0  |  0  0  0  |  0  0  2 |
      ----------------------------------
```

19:54 : let's display "-" instead of "0"

```javascript
export function displayGrid(grid) {
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

  console.log(gridToDisplay);
}
```

```
displayGrid(grid);
      ----------------------------------
     |  -  -  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------
```

20:00 : Ok now let's try to add a number on the first spot : grid[0][0] :

```javascript
test("try to add a number on first spot 0 0 ", () => {
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
    squaresSets
  );

  let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
    setsForSpotOnGrid
  );

  let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
    missingSetsForSpotOnGrid
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
    squaresSets
  );

  missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
    setsForSpotOnGrid
  );

  listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
    missingSetsForSpotOnGrid
  );

  expect(listOfPossibilityForSpecificSpot).toEqual([3, 4, 5, 6, 7]);
});
```

```
      ----------------------------------
     |  -  -  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------

      ----------------------------------
     |  2  -  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------

```

IT WORKS !!!!!!

Next step 3 iterations :

20:12

```javascript
test("try to add a number on first 3 spots", () => {
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
    if (grid[i][j] !== 0) break;

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

    let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
      missingSetsForSpotOnGrid
    );

    grid[i][j] = listOfPossibilityForSpecificSpot[0];

    displayGrid(grid);
  }
});
```

```


      ----------------------------------
     |  2  -  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  4  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------

```

YEAAAAH !!!

20:12 :

NOOOOB alert ^^

```javascript
if (grid[i][j] !== 0) break;
```

I wanted to continue, to to break the loop ....

```javascript
if (grid[i][j] !== 0) continue;
```

20:14 : IT WOOORKS !!!

```javascript
test("try to add a number on first line ", () => {
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
      squaresSets
    );

    let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
      setsForSpotOnGrid
    );

    let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
      missingSetsForSpotOnGrid
    );

    grid[i][j] = listOfPossibilityForSpecificSpot[0];

    displayGrid(grid);
  }
});
```

```

      ----------------------------------
     |  2  -  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  -  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  4  |  -  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  4  |  5  -  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------



      ----------------------------------
     |  2  3  4  |  5  6  1  |  -  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  4  |  5  6  1  |  7  -  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  4  |  5  6  1  |  7  8  - |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------


      ----------------------------------
     |  2  3  4  |  5  6  1  |  7  8  9 |
     |  -  -  9  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  3  -  - |
      ----------------------------------
     |  -  -  -  |  -  1  -  |  -  -  - |
     |  -  6  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  5  - |
      ----------------------------------
     |  8  -  -  |  -  -  -  |  -  -  - |
     |  -  -  -  |  7  -  -  |  -  -  - |
     |  -  -  -  |  -  -  -  |  -  -  2 |
      ----------------------------------

```

20:18 : Let's go, now all the grid !

```javascript
test("try to add a number on all the grid", () => {
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

  for (let i = 0; i < grid.length; i++) {
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
        squaresSets
      );

      let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid
      );

      let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
        missingSetsForSpotOnGrid
      );

      grid[i][j] = listOfPossibilityForSpecificSpot[0];

      displayGrid(grid);
    }
  }
});
```

```

      ----------------------------------
     |  2  3  4  |  5  6  1  |  7  8  9 |
     |  1  5  9  |  2  3  4  |  6  undefined  undefined |
     |  6  7  8  |  9  undefined  undefined  |  3  2  4 |
      ----------------------------------
     |  3  2  5  |  4  1  6  |  8  7  undefined |
     |  4  6  1  |  3  2  5  |  9  undefined  undefined |
     |  7  8  undefined  |  undefined  9  undefined  |  2  5  3 |
      ----------------------------------
     |  8  1  2  |  6  4  3  |  5  9  7 |
     |  5  4  3  |  7  8  2  |  1  6  undefined |
     |  9  undefined  6  |  undefined  5  undefined  |  4  3  2 |
      ----------------------------------

```

20:20 : Mmmmmm maybe sometime it doesn't find any solutiuon for this spot

Code added :

```javascript
if (!listOfPossibilityForSpecificSpot.length) continue;
```

```
      ----------------------------------
     |  2  3  4  |  5  6  1  |  7  8  9 |
     |  1  5  9  |  2  3  4  |  6  -  - |
     |  6  7  8  |  9  -  -  |  3  1  4 |
      ----------------------------------
     |  3  2  5  |  4  1  6  |  8  7  - |
     |  4  6  1  |  3  2  5  |  9  -  - |
     |  7  8  -  |  -  9  -  |  1  5  3 |
      ----------------------------------
     |  8  1  2  |  6  4  3  |  5  9  7 |
     |  5  4  3  |  7  8  2  |  -  6  1 |
     |  9  -  6  |  1  5  -  |  4  3  2 |
      ----------------------------------
```

IT WOOORKS !!

20:22 : Ok so it might be time to make a function in order to call it again if needed

```javascript
export function resolveOneIteration(grid) {
  for (let i = 0; i < grid.length; i++) {
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
        squaresSets
      );

      let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid
      );

      let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
        missingSetsForSpotOnGrid
      );

      if (!listOfPossibilityForSpecificSpot.length) continue;

      grid[i][j] = listOfPossibilityForSpecificSpot[0];
    }
  }
  displayGrid(grid);
}
```

```javascript
test("try to add a number on all the grid line ", () => {
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

  resolveOneIteration(grid);
});
```

```
     ----------------------------------
     |  2  3  4  |  5  6  1  |  7  8  9 |
     |  1  5  9  |  2  3  4  |  6  -  - |
     |  6  7  8  |  9  -  -  |  3  1  4 |
      ----------------------------------
     |  3  2  5  |  4  1  6  |  8  7  - |
     |  4  6  1  |  3  2  5  |  9  -  - |
     |  7  8  -  |  -  9  -  |  1  5  3 |
      ----------------------------------
     |  8  1  2  |  6  4  3  |  5  9  7 |
     |  5  4  3  |  7  8  2  |  -  6  1 |
     |  9  -  6  |  1  5  -  |  4  3  2 |
      ----------------------------------
```

Ok, still working !

20:28 : Remove display grid from function

```javascript
test("try to add a number on all the grid line ", () => {
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

  resolveOneIteration(grid);

  displayGrid(grid);
});
```

```
     ----------------------------------
     |  2  3  4  |  5  6  1  |  7  8  9 |
     |  1  5  9  |  2  3  4  |  6  -  - |
     |  6  7  8  |  9  -  -  |  3  1  4 |
      ----------------------------------
     |  3  2  5  |  4  1  6  |  8  7  - |
     |  4  6  1  |  3  2  5  |  9  -  - |
     |  7  8  -  |  -  9  -  |  1  5  3 |
      ----------------------------------
     |  8  1  2  |  6  4  3  |  5  9  7 |
     |  5  4  3  |  7  8  2  |  -  6  1 |
     |  9  -  6  |  1  5  -  |  4  3  2 |
      ----------------------------------
```

Still Working !!

20:31 : Calling resolveOneIteration(grid); is not enough ;

```javascript
  |  2  3  4  |  5  6  1  |  7  8  9 |
  |  1  5  9  |  2  3  4  |  6  -  - |
  |  6  7  8  |  9  -  -  |  3  1  4 |
```

Our grid is WRONG : the last square can't have any 2

It's time to add some back-tracking : this path is wrong we have to try another one
For the moment we try to add the first possibility for each spot, eahc time we try a possibility we must call a function recursively to try all the pssibility

Let's first try with an easy grid, with less possibilities :

```javascript
test("try to add a number on all the grid line ", () => {
  const grid = [
    [3, 0, 0, 2, 0, 1, 0, 0, 0],
    [7, 4, 0, 0, 0, 0, 0, 1, 9],
    [0, 2, 0, 0, 6, 0, 5, 0, 0],
    [0, 3, 0, 7, 4, 0, 0, 0, 1],
    [0, 0, 8, 0, 0, 0, 9, 0, 0],
    [6, 0, 0, 0, 9, 2, 0, 5, 0],
    [0, 0, 2, 0, 8, 0, 0, 4, 0],
    [1, 5, 0, 0, 0, 0, 0, 9, 7],
    [0, 0, 0, 9, 0, 3, 0, 0, 2],
  ];

  resolveOneIteration(grid);

  displayGrid(grid);
});
```

```
      ----------------------------------
     |  3  6  5  |  2  7  1  |  4  8  - |
     |  7  4  -  |  3  5  8  |  2  1  9 |
     |  8  2  1  |  4  6  9  |  5  3  - |
      ----------------------------------
     |  2  3  9  |  7  4  5  |  6  -  1 |
     |  4  1  8  |  6  3  -  |  9  2  - |
     |  6  7  -  |  1  9  2  |  3  5  4 |
      ----------------------------------
     |  9  -  2  |  5  8  6  |  1  4  3 |
     |  1  5  3  |  -  2  4  |  8  9  7 |
     |  -  8  4  |  9  1  3  |  -  6  2 |
      ----------------------------------
```

Same probleme, too much solutiuons :)

20:44 : It's not that there are too much solutiuons, the algorith of always selecting the first possibility can't work, we should maybe trys to add where there is only one possibility and try again

20:47 : Add this code :

```javascript
if (listOfPossibilityForSpecificSpot.length !== 1) continue;
```

```javascript
test("try to add a number on all the grid line ", () => {
  const grid = [
    [0, 6, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 6, 5, 1, 0, 0, 0],
    [1, 0, 7, 0, 0, 0, 6, 0, 2],
    [6, 2, 0, 3, 0, 5, 0, 9, 4],
    [0, 0, 3, 0, 0, 0, 2, 0, 0],
    [4, 8, 0, 9, 0, 7, 0, 3, 6],
    [9, 0, 6, 0, 0, 0, 4, 0, 8],
    [0, 0, 0, 7, 9, 4, 0, 0, 0],
    [0, 5, 0, 0, 0, 0, 0, 7, 0],
  ];

  displayGrid(grid);

  resolveOneIteration(grid);

  displayGrid(grid);
});
```

```

Before

      ----------------------------------
     |  -  6  -  |  -  -  -  |  -  1  - |
     |  -  -  -  |  6  5  1  |  -  -  - |
     |  1  -  7  |  -  -  -  |  6  -  2 |
      ----------------------------------
     |  6  2  -  |  3  -  5  |  -  9  4 |
     |  -  -  3  |  -  -  -  |  2  -  - |
     |  4  8  -  |  9  -  7  |  -  3  6 |
      ----------------------------------
     |  9  -  6  |  -  -  -  |  4  -  8 |
     |  -  -  -  |  7  9  4  |  -  -  - |
     |  -  5  -  |  -  -  -  |  -  7  - |
      ----------------------------------

After

      ----------------------------------
     |  -  6  -  |  -  -  -  |  -  1  - |
     |  -  -  -  |  6  5  1  |  -  -  - |
     |  1  -  7  |  -  -  -  |  6  -  2 |
      ----------------------------------
     |  6  2  1  |  3  8  5  |  7  9  4 |
     |  -  -  3  |  -  -  6  |  2  -  - |
     |  4  8  5  |  9  -  7  |  1  3  6 |
      ----------------------------------
     |  9  -  6  |  -  -  -  |  4  -  8 |
     |  -  -  -  |  7  9  4  |  -  -  - |
     |  -  5  -  |  -  -  -  |  -  7  - |
      ----------------------------------

```

20:53 : Ok and with multiple itteration ? let's try with 10 iterations

```javascript
test("try to add a number on all the grid line ", () => {
  const grid = [
    [0, 6, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 6, 5, 1, 0, 0, 0],
    [1, 0, 7, 0, 0, 0, 6, 0, 2],
    [6, 2, 0, 3, 0, 5, 0, 9, 4],
    [0, 0, 3, 0, 0, 0, 2, 0, 0],
    [4, 8, 0, 9, 0, 7, 0, 3, 6],
    [9, 0, 6, 0, 0, 0, 4, 0, 8],
    [0, 0, 0, 7, 9, 4, 0, 0, 0],
    [0, 5, 0, 0, 0, 0, 0, 7, 0],
  ];

  for (let i = 0; i < 9; i++) {
    displayGrid(grid);

    resolveOneIteration(grid);
  }
});
```

```

      ----------------------------------
     |  -  6  -  |  -  -  -  |  -  1  - |
     |  -  -  -  |  6  5  1  |  -  -  - |
     |  1  -  7  |  -  -  -  |  6  -  2 |
      ----------------------------------
     |  6  2  -  |  3  -  5  |  -  9  4 |
     |  -  -  3  |  -  -  -  |  2  -  - |
     |  4  8  -  |  9  -  7  |  -  3  6 |
      ----------------------------------
     |  9  -  6  |  -  -  -  |  4  -  8 |
     |  -  -  -  |  7  9  4  |  -  -  - |
     |  -  5  -  |  -  -  -  |  -  7  - |
      ----------------------------------


      ----------------------------------
     |  5  6  8  |  4  7  2  |  3  1  9 |
     |  2  3  9  |  6  5  1  |  8  4  7 |
     |  1  4  7  |  8  3  9  |  6  5  2 |
      ----------------------------------
     |  6  2  1  |  3  8  5  |  7  9  4 |
     |  7  9  3  |  1  4  6  |  2  8  5 |
     |  4  8  5  |  9  2  7  |  1  3  6 |
      ----------------------------------
     |  9  7  6  |  5  1  3  |  4  2  8 |
     |  8  1  2  |  7  9  4  |  5  6  3 |
     |  3  5  4  |  2  6  8  |  9  7  1 |
      ----------------------------------

```

IT WORKS !!!

21:00 : Enough for today :

- Test if the grid is Full & loop until it's full

- Test if the grid is incorrect : no mor possibilities to stop the loop

23:25 : Working on noMorePossibilities

23:42 :

```javascript
export function hasMorePossibilities(grid) {
  let morePossibilities = false;

  for (let i = 0; i < grid.length; i++) {
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
        squaresSets
      );

      let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid
      );

      let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
        missingSetsForSpotOnGrid
      );

      morePossibilities = listOfPossibilityForSpecificSpot.length !== 0;
    }
  }

  return morePossibilities;
}
```

```javascript
test("try to add a number on all the grid line ", () => {
  const grid = [
    [0, 6, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 6, 5, 1, 0, 0, 0],
    [1, 0, 7, 0, 0, 0, 6, 0, 2],
    [6, 2, 0, 3, 0, 5, 0, 9, 4],
    [0, 0, 3, 0, 0, 0, 2, 0, 0],
    [4, 8, 0, 9, 0, 7, 0, 3, 6],
    [9, 0, 6, 0, 0, 0, 4, 0, 8],
    [0, 0, 0, 7, 9, 4, 0, 0, 0],
    [0, 5, 0, 0, 0, 0, 0, 7, 0],
  ];

  displayGrid(grid);

  while (hasMorePossibilities(grid)) {
    resolveOneIteration(grid);
  }
  displayGrid(grid);
});
```

Works if only one solution but infinity loop if multiple ones

```javascript
test("try to add a number on all the grid line ", () => {
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

  while (hasMorePossibilities(grid)) {
    resolveOneIteration(grid);
    displayGrid(grid);
  }
});
```

===> INFINITY LOOP

23:52 : Found online a grid with two solutions :

```
      ----------------------------------
     |  9  2  6  |  5  7  1  |  4  8  3 |
     |  3  5  1  |  4  8  6  |  2  7  9 |
     |  8  7  4  |  9  2  3  |  5  1  6 |
      ----------------------------------
     |  5  8  2  |  3  6  7  |  1  9  4 |
     |  1  4  9  |  2  5  8  |  3  6  7 |
     |  7  6  3  |  1  -  -  |  8  2  5 |
      ----------------------------------
     |  2  3  8  |  7  -  -  |  6  5  1 |
     |  6  1  7  |  8  3  5  |  9  4  2 |
     |  4  9  5  |  6  1  2  |  7  3  8 |
      ----------------------------------
```

03:00 .... it was sooo hard ^^ Maybe doing this so late isn't a good idea ...but it WOOOOORKS !!

I lost so much time working on a grid with too much possibilities, I thought my algorithm was stuck in an infinity loop ....

```javascript
export function hasEmptySpot(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

export function bestSpotWithFewerPossibility(grid) {
  if (!hasEmptySpot(grid)) {
    return [-1, -1];
  }

  let amountOfPossibilities = 20;
  let row = -1;
  let column = -1;

  for (let i = 0; i < grid.length; i++) {
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
        squaresSets
      );

      let missingSetsForSpotOnGrid = getMissingBinarySetFromBinarySet(
        setsForSpotOnGrid
      );

      let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
        missingSetsForSpotOnGrid
      );

      if (listOfPossibilityForSpecificSpot.length === 1) {
        return [i, j];
      } else {
        if (amountOfPossibilities > listOfPossibilityForSpecificSpot.length) {
          amountOfPossibilities = listOfPossibilityForSpecificSpot.length;
          column = j;
          row = i;
        }
      }
    }
  }

  return [row, column];
}

export function resolve(grid) {
  const [i, j] = bestSpotWithFewerPossibility(grid);

  if (i === -1 && j === -1) {
    displayGrid(grid);
    return;
  }

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

  let listOfPossibilityForSpecificSpot = decimalSetToNumbersList(
    missingSetsForSpotOnGrid
  );

  listOfPossibilityForSpecificSpot.forEach((possibility) => {
    const newGrid = _.cloneDeep(grid);

    newGrid[i][j] = possibility;

    return resolve(newGrid);
  });
}
```

```javascript
test("resolve", () => {
  const grid = [
    [0, 0, 0, 6, 0, 0, 0, 2, 0],
    [8, 0, 1, 0, 0, 7, 9, 0, 0],
    [6, 0, 0, 0, 0, 4, 1, 0, 0],
    [0, 0, 5, 0, 0, 8, 0, 0, 0],
    [0, 2, 8, 5, 6, 0, 4, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 8, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 7],
    [0, 0, 0, 7, 0, 0, 0, 1, 0],
    [1, 5, 0, 0, 0, 0, 0, 0, 4],
  ];

  resolve(grid);
});
```

```
  ----------------------------------
 |  5  4  9  |  6  1  3  |  7  2  8 |
 |  8  3  1  |  2  5  7  |  9  4  6 |
 |  6  7  2  |  9  8  4  |  1  3  5 |
  ----------------------------------
 |  4  1  5  |  3  7  8  |  2  6  9 |
 |  9  2  8  |  5  6  1  |  4  7  3 |
 |  7  6  3  |  4  2  9  |  5  8  1 |
  ----------------------------------
 |  2  8  4  |  1  9  6  |  3  5  7 |
 |  3  9  6  |  7  4  5  |  8  1  2 |
 |  1  5  7  |  8  3  2  |  6  9  4 |
  ----------------------------------
```

```javascript
test("resolve", () => {
  const grid = [
    [0, 0, 0, 6, 0, 0, 0, 2, 0],
    [8, 0, 1, 0, 0, 7, 9, 0, 0],
    [0, 0, 0, 0, 0, 4, 1, 0, 0], // <= removed the first 6
    [0, 0, 5, 0, 0, 8, 0, 0, 0],
    [0, 2, 8, 5, 6, 0, 4, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 8, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 7],
    [0, 0, 0, 7, 0, 0, 0, 1, 0],
    [1, 5, 0, 0, 0, 0, 0, 0, 4],
  ];

  resolve(grid);
});
```

```

  ----------------------------------
 |  5  4  3  |  6  1  9  |  7  2  8 |
 |  8  6  1  |  3  2  7  |  9  4  5 |
 |  7  9  2  |  8  5  4  |  1  3  6 |
  ----------------------------------
 |  4  7  5  |  9  3  8  |  2  6  1 |
 |  9  2  8  |  5  6  1  |  4  7  3 |
 |  3  1  6  |  4  7  2  |  5  8  9 |
  ----------------------------------
 |  2  3  4  |  1  9  6  |  8  5  7 |
 |  6  8  9  |  7  4  5  |  3  1  2 |
 |  1  5  7  |  2  8  3  |  6  9  4 |
  ----------------------------------

        ( ... 36 solutions ... )

  ----------------------------------
 |  5  4  3  |  6  1  9  |  7  2  8 |
 |  8  6  1  |  3  2  7  |  9  4  5 |
 |  7  9  2  |  8  5  4  |  1  3  6 |
  ----------------------------------
 |  4  7  5  |  9  3  8  |  2  6  1 |
 |  9  2  8  |  5  6  1  |  4  7  3 |
 |  3  1  6  |  4  7  2  |  5  8  9 |
  ----------------------------------
 |  2  8  4  |  1  9  6  |  3  5  7 |
 |  6  3  9  |  7  4  5  |  8  1  2 |
 |  1  5  7  |  2  8  3  |  6  9  4 |
  ----------------------------------
```

03:21 : So I started at 12:00, made 4h of pause so I managed to do it in less than 12 hours !!!

The next step is the UI, but for now time to sleep :)

09:40 : Time to optimize it, resolve should not have to refind the possibilities, it was already computed in bestSpotWithFewerPossibility, bestSpotWithFewerPossibility should return i,j and the possibilities

10:00 : IT WOORKS !!

bestSpotWithFewerPossibility now return the row, column AND possibilities array for the best spot

```javascript

export function bestSpotWithFewerPossibility(grid) {
    ...
    let row = -1;
    let column = -1;
    let possibilities;
...
            if (listOfPossibilityForSpecificSpot.length === 1) {
                return [i, j, listOfPossibilityForSpecificSpot];
          ...
                    row = i;
                    column = j;
                    possibilities = listOfPossibilityForSpecificSpot;
             ...
    return [row, column, possibilities];
}
```

And resovle only test with all the possibilities

```javascript
export function resolve(grid) {
  const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

  if (i === -1 && j === -1) {
    displayGrid(grid);
    return;
  }

  possibilities.forEach((possibility) => {
    const newGrid = _.cloneDeep(grid);

    newGrid[i][j] = possibility;

    return resolve(newGrid);
  });
}
```

Little benchmark with this grid :

```javascript
const grid = [
  [0, 0, 0, 6, 0, 0, 0, 2, 0],
  [8, 0, 1, 0, 0, 7, 9, 0, 0],
  [0, 0, 0, 0, 0, 4, 1, 0, 0],
  [0, 0, 0, 0, 0, 8, 0, 0, 0],
  [0, 2, 8, 5, 6, 0, 4, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 7],
  [0, 0, 0, 7, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 4],
];

const before = Date.now();

resolve(grid);

const after = Date.now() - before;

console.log(after);
```

Old algorithm :

```bash
13914
13897
13959
```

New Algorithm :

```bash
12793
12745
12881
```

So 1 second less !!!!

10:10 : Now it's time to add the result array to store all the valide grids

10:18 : result added :

```javascript
export function resolve(grid, result) {
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
```

Same benshmark :

```javascript
const grid = [
  [0, 0, 0, 6, 0, 0, 0, 2, 0],
  [8, 0, 1, 0, 0, 7, 9, 0, 0],
  [0, 0, 0, 0, 0, 4, 1, 0, 0],
  [0, 0, 0, 0, 0, 8, 0, 0, 0],
  [0, 2, 8, 5, 6, 0, 4, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 7],
  [0, 0, 0, 7, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 4],
];

const result = [];

const before = Date.now();

resolve(grid, result);

const after = Date.now() - before;

console.log(`Computed ${result.length + 1} results in ${after} milliseconds`);
```

```bash
Computed 91573 results in 13056 milliseconds
Computed 91573 results in 13544 milliseconds
Computed 91573 results in 13619 milliseconds
```

... So adding the result array slow the algorithm, at half a second to a full second

10:33 It's time to add the UI, later this code will be added to a lib inside a react app but for now let's create the app in another directory :

10:41 : Actually let's try to create a React app with Parcel

```bash
yarn add --dev parcel-bundler
```

10:43 : Ok now let's create an index.html :

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Sudoku App</title>
  </head>

  <body>
    Hello world!
  </body>
</html>
```

Add Parcel command to package.json :

```json
    "start": "parcel index.html --open"
```

Execute parcel :

```bash
yarn start
```

ERROR

```bash
yarn run v1.22.4
$ parcel --open
Server running at http://localhost:1234
🚨  No entries found.
```

10:50 :

... strange, I have to tell parel to use index.html

```json
    "start": "parcel index.html --open"
```

Execute parcel :

```bash
yarn start
```

And it works

```
$ parcel index.html --open
Server running at http://localhost:1234
✨  Built in 47ms.
```

10:52 : let's now add some js

```javascript
console.log("HELLO");
```

Add the javascript to index.html :

```html
<body>
  Hello world!
  <script src="index.js"></script>
</body>
```

10:55 : ERROR :

```bash
Server running at http://localhost:1234
🚨  ... index.js: Invalid Version: undefined
```

.... https://stackoverflow.com/questions/66459081/parcel-semver-bug :

It is a well-known problem in the newest version of Parcel.

The solution of this problem was to revert back to version 1.12.3, or by updating to the version 2 of Parcel. You can do the first solution by:

```html
npm uninstall parcel-bundler npm i --save-dev parcel-bundler@1.12.3
```

The second solution could be done like this:

```html
npm i --save-dev parcel@next
```

ok ... let's try

```bash
yarn add --dev parcel@next
```

NOPE :

```bash
Server running at http://localhost:1234
🚨  ... index.js: Invalid Version: undefined
```

second try :

```bash
yarn remove parcel-bundler
yarn add  --dev parcel-bundler@1.12.3
```

Yeaaah ... it works ...

```bash
Server running at http://localhost:1234
✨  Built in 21ms.
```

11:03 : Ok now let's prepare for React :

crete .babelrc :

```
{ "presets": ["env", "react"] }
```

Ajout des presets pour react et le JSX:

```bash
yarn add --dev babel-preset-env babel-preset-react
```

Installation de react :

```bash
yarn add react react-dom
```

11:05 : Change index.html :

```html
<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
```

Change index.js :

```javascript
import React from "react";
import { render } from "react-dom";

render(<div>Hello world from React!</div>, document.querySelector("#root"));
```

```bash
yarn start
```

```bash
$ parcel index.html --open
Server running at http://localhost:1234
✨  Built in 2.44s.
```

And in the browser :

```
Hello world from React !
```

11:08 let's try to build for prod :

change to package.json :

```json
        "build": "parcel build"
```

```bash
yarn build
```

ERROR

```bash
$ parcel build
🚨  No entries found.
    at Bundler.bundle
```

.... Still have to tell Parcel to use index.html

change to package.json :

```json
        "build": "parcel build index.html"
```

```bash
yarn build
```

```bash
yarn run v1.22.4
$ parcel build index.html
✨  Built in 3.24s.

dist/sudoku.57828944.js.map    267.88 KB     38ms
dist/sudoku.57828944.js        129.34 KB    2.24s
dist/index.html                    292 B    923ms
✨  Done in 4.38s.
```

Let's try to serve the build :

```bash
 http-server ./dist/
```

```bash
Starting up http-server, serving ./dist/
Available on:
 http://127.0.0.1:8080
 http://192.168.0.165:8080
Hit CTRL-C to stop the server
[2021-03-06T10:12:20.994Z] "GET /" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15"
(node:49938) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
(Use `node --trace-deprecation ...` to show where the warning was created)
[2021-03-06T10:12:21.026Z] "GET /sudoku.57828944.js" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15"
[2021-03-06T10:12:21.068Z] "GET /favicon.ico" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15"
[2021-03-06T10:12:21.070Z] "GET /favicon.ico" Error (404): "Not found"

```

11:14 : Ok it's working .... but what about typescript :D

let's create a tsconfig file :

```bash
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

change extensions from index.js to index.tsx and change import in index.html :

Change index.html :

```html
<body>
  <div id="root"></div>
  <script src="index.tsx"></script>
</body>
```

11:20 Add a "React not found" ERROR ... remove .cache directory and restart, it works

11:27 : test Typescript in index.tsx :

```javascript
function sum(firstParam: number, secondParam: number) {
  return firstParam + secondParam;
}

console.log(sum(3, 4));
```

it works "7" dispaly in browser console

11:28 : Change .gitignore : add .cache & dist

```bash
.DS_Store
node_modules
.vscode
.cache
dist
```

11:30 : Ok now let's add styled-components

```bash
yarn add --dev styled-components
```

https://styled-components.com/docs/basics#installation

```

If you use a package manager like yarn that supports the "resolutions" package.json field, we also highly recommend you add an entry to it as well corresponding to the major version range. This helps avoid an entire class of problems that arise from multiple versions of styled-components being installed in your project.

In package.json:

{
  "resolutions": {
    "styled-components": "^5"
  }
}

```

... OK Why not ...

Change to package.json :

```json
  "resolutions": {
    "styled-components": "^5"
  }
```

11:38 : Test styled components :

index.tsx :

```javascript
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

render(
  <Wrapper>
    <Title>Hello World!</Title>
  </Wrapper>,
  document.querySelector("#root")
);
```

It works !!!

11:40 : OK So everything is ready we can start : let's create a componenet to display a grid :

Create a ./src directory and move index.tsx and index.html + update package.json

11:45 : Install storybook :

```
npx sb init
```

Remove unused files installed by storybook

Create a Grid.tsx && Grid.stories.tsx :

```javascript
// Grid.tsx

import React from "react";

const Grid = () => {
  return <div>GRID</div>;
};

export default Grid;
```

```javascript
// Grid.stories.tsx

import React from "react";

import Grid from "./Grid";

export const GridStory = () => <Grid />;

export default {
  title: "Grid",
  component: Grid,
};
```

Try to run Storybook

```bash
yarn storybook
```

ERROR

```bahsh
ERROR in ./.storybook/storybook-init-framework-entry.js
Module build failed (from ./node_modules/@storybook/core/node_modules/babel-loader/lib/index.js):
Error: Plugin/Preset files are not allowed to export objects, only functions. in ... /node_modules/babel-preset-react/lib/index.js

```

https://github.com/storybookjs/storybook/issues/3843

babel-core missing ?

```bash
yarn add --dev babel-core
```

NOPE

12:10 : WHAT THE F**\*\***CK !!!

Storybook need it's own .babelrc :

```json
// .storybook/.babelrc

{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

It works now ....

12:12 : Another error :

```javascript
import React from "react";
```

creates an error :

```
Module '"/Users/amaury/Documents/AE/sudoku/node_modules/@types/react/index"' can only be default-imported using the 'esModuleInterop' flagts(1259)
```

copy paste tsconfig.json file from another project :

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "strict": false
  },
  "include": ["src"]
}
```

it works now

12:16 : OK NOW WE CAN START !!! 2h to have a working environment ^^

Changed Grid.tsx to

```javascript
interface GridProps {
  grid: number[][];
}

const Grid = ({ grid }: GridProps) => {
  return <div>GRID</div>;
};
```

ERROR from storybook :

```bash
ERROR in ./src/Component/Grid.tsx
Module build failed (from ./node_modules/@storybook/core/node_modules/babel-loader/lib/index.js):
SyntaxError: /Users/amaury/Documents/AE/sudoku/src/Component/Grid.tsx: Unexpected reserved word 'interface' (3:0)

  1 | import React from 'react';
  2 |
> 3 | interface GridProps {
    | ^
  4 |     grid: number[][];
  5 | }
```

12:56 OMG no wonder I use creat-react-app ....

I followed https://www.npmjs.com/package/@storybook/preset-typescript but still not working

```bash
Identifier 'React' has already been declared (7:7)
```

12:51 : time for a break .... And maybe time to use create-react-app to avoid all this bullshit !! My god that's exactly why a switched to create react app, 3 to 4 hour and nothing written just some configuration ... WHY !!!!????

13:20 : OK, enough of this, time to use create react app

```bash
yarn create react-app sudoku-react --template typescript
```

```bash
cd sudoku-react/
```

```bash
yarn add typescript @types/node @types/react @types/react-dom @types/jest
```

```bash
yarn add styled-components @types/styled-components
```

```
npx sb init
```

remove ./src/stories directory

create Grid.tsx && Grid.stories.tsx

```javascript
//Grid.tsx
import React from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

interface GridProps {
  grid: number[][];
}

const Grid = ({ grid }: GridProps) => {
  return (
    <Wrapper>
      <Title>Hello World!</Title>
      <div>GRID</div>
    </Wrapper>
  );
};

export default Grid;
```

```javascript
//Grid.stories.tsx

import React from "react";

import Grid from "./Grid";

const grid = [
  [0, 0, 0, 6, 0, 0, 0, 2, 0],
  [8, 0, 1, 0, 0, 7, 9, 0, 0],
  [0, 0, 0, 0, 0, 4, 1, 0, 0],
  [0, 0, 0, 0, 0, 8, 0, 0, 0],
  [0, 2, 8, 5, 6, 0, 4, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 7],
  [0, 0, 0, 7, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 4],
];

export const GridStory = () => <Grid grid={grid} />;

export default {
  title: "Grid",
  component: GridStory,
};
```

13:30 : And it WOOORKS !!!

Add a directory for the utils functions to resovle sudoku, clean all AND ...

14:06 : BAM I can finally work on the UI

14:14 : A grid is displayed in a react component !! It only took me 4 hours ^^

It's only in ASCII art for now, time to make a better grid :

15:22 : The UI can display a grid, can click on an spot to get in console its possibilities, can change a value, no check for the moment

18h00 : Sooo what has been added to the UI ?

- Can click on a spot to get the possibilities for this spot
- Add buttons with the possibilies, click on one of them and it's added to the grid
- Can get a hin and au select the easiest spot
- Can auto add one number
- Can solve the grid each number at a time
- Stop if the grid has multiple solutions
- Display an error message and tell if the value added manually is in the row / colum / square

18:23 I am really not happy with the UI

Let's make from scratch a grid in css

19:02 : New css for responsive grid done

20:40 : It's still not perfect but a little better, more responsive

09:08 We still have multiple things to had :

- solve with multiple solutions
- Generate a random grid
- highlight the errors on the grid
- clean the grid back to its original value

09:23 : Reset grid done, hade to use \_.cloneDeep

```javascript
const newGrid = _.cloneDeep(gridWithOneSolution);
setGrid(newGrid);
```

09:56:

I just added a button "Resolve ALL" to compute all solutions and PREViOUS & NEXT to browse solutions

=> I should had a function to count how many numbers are in the grid, if less than n say that there are too much solutions

10:28 : Ok button and function added BUT new problem :

- Question : What happens if the grid is wrong and we ask the function to compute alle the solution ??
- Answer : .... good question ... apparently it doesn't work, it does nothing

10:38 : So if the grid is wrong ... it simply doesn't find any solutions .... message added : "GRID IS WRONG : NO solution found"

10:39 : Still have to add

- Generate a random grid
- highlight the errors on the grid

but first ... WHY ARE THE BUTTONS SO SMALL ON MOBILE !!!!

11:06 : better buttons

NOW ... how could I generate a random grid ....
