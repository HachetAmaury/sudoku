// const grid = [
//     [0, 0, 0, 0, 0, 1, 0, 0, 0],
//     [0, 0, 9, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 3, 0, 0],
//     [0, 0, 0, 0, 1, 0, 0, 0, 0],
//     [0, 6, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 5, 0],
//     [8, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 7, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 2],
// ];

import { displayGrid, resolve } from './utils';

// function displayGrid(grid) {
//     let gridToDisplay = '';
//     for (let i = 0; i < grid.length; i++) {
//         if (i % 3 === 0)
//             gridToDisplay += '  ----------------------------------' + '\n';

//         for (let j = 0; j < grid.length; j++) {
//             if (j % 3 === 0) gridToDisplay += ' | ';
//             gridToDisplay += ` ${grid[i][j]} `;
//         }
//         gridToDisplay += '| \n';
//     }
//     gridToDisplay += '  ----------------------------------' + '\n';

//     console.log(gridToDisplay);
// }

// displayGrid(grid);

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

// result.map((grid, indice) => {
//     console.log('Result n°', indice + 1);

//     displayGrid(grid);
// });

console.log(`Computed ${result.length + 1} results in ${after} milliseconds`);

// const result = [];
// resolveOneIteration(grid, result);

// result.map((grid) => {
//     displayGrid(grid);
// });
