import { wait } from "@testing-library/dom";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  bestSpotWithFewerPossibility,
  decimalSetHasNumber,
  displayGridStr,
  getColumnsSetsFromGrid,
  getRowsSetsFromGrid,
  getSquaresSetsFromGrid,
  GridType,
  listOfPossibilityForSpecificSpot,
} from "../sudokuLib/utils";
import GridItem from "./GridItem";

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  width: 100vw;

  .left {
    width: 50vw;
    height: 50vw;
  }

  .right {
  }

  button {
    height: 60px;
    padding: 20px;
    border-radius: 10px;
  }
`;

const StyledSudokuGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(9, [col-start] 1fr);
  border: 3px solid black;
`;

const Grid = () => {
  // const [grid, setGrid] = useState([
  //   [0, 0, 0, 0, 0, 1, 0, 0, 0],
  //   [0, 0, 9, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 3, 0, 0],
  //   [0, 0, 0, 0, 1, 0, 0, 0, 0],
  //   [0, 6, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 5, 0],
  //   [8, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 7, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 2],
  // ]);

  // const [grid, setGrid] = useState([
  //   [7, 0, 0, 0, 0, 0, 0, 0, 4],
  //   [0, 0, 8, 0, 3, 7, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 4, 3, 7, 6],
  //   [0, 5, 0, 0, 0, 0, 0, 2, 0],
  //   [2, 0, 6, 7, 8, 9, 0, 0, 0],
  //   [3, 0, 7, 0, 0, 1, 4, 6, 0],
  //   [9, 0, 0, 6, 0, 3, 0, 5, 1],
  //   [0, 0, 0, 1, 0, 2, 8, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 7],
  // ]);

  const [grid, setGrid] = useState([
    [0, 3, 0, 0, 0, 1, 6, 0, 0],
    [0, 0, 0, 0, 4, 0, 9, 0, 0],
    [4, 0, 8, 0, 0, 0, 1, 7, 5],
    [8, 0, 0, 0, 9, 7, 0, 2, 1],
    [3, 1, 7, 2, 0, 6, 0, 0, 0],
    [0, 0, 0, 1, 5, 3, 0, 0, 0],
    [0, 4, 0, 0, 2, 0, 0, 5, 3],
    [0, 5, 9, 0, 3, 0, 0, 0, 7],
    [2, 0, 0, 0, 0, 0, 0, 0, 9],
  ]);

  // const [grid, setGrid] = useState([
  //   [0, 0, 0, 6, 0, 0, 0, 2, 0],
  //   [8, 0, 1, 0, 0, 7, 9, 0, 0],
  //   [0, 0, 0, 0, 0, 4, 1, 0, 0],
  //   [0, 0, 5, 0, 0, 8, 0, 0, 0],
  //   [0, 2, 8, 5, 6, 0, 4, 0, 3],
  //   [0, 0, 0, 0, 0, 0, 0, 8, 0],
  //   [0, 0, 0, 0, 9, 0, 0, 0, 7],
  //   [0, 0, 0, 7, 0, 0, 0, 1, 0],
  //   [1, 5, 0, 0, 0, 0, 0, 0, 4],
  // ]);

  // let columnsSets = getColumnsSetsFromGrid(grid);
  // let rowsSets = getRowsSetsFromGrid(grid);
  // let squaresSets = getSquaresSetsFromGrid(grid);

  const [possibilities, setPossibilities] = useState([0]);

  const [hint, setHint] = useState("");

  const [itemSelected, setItemSelected] = useState([-1, -1]);

  const [info, setInfo] = useState("");

  useEffect(() => {
    // const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);
  }, [grid]);

  const onGridItemChange = (value: number, row: number, column: number) => {
    console.log(`${row} ${column} ${value}`);

    let possibilitiesTemp = listOfPossibilityForSpecificSpot(grid, row, column);

    if (value !== 0 && possibilitiesTemp.indexOf(value) == -1) {
      let error = "Error ";

      let columnsSets = getColumnsSetsFromGrid(grid);
      let rowsSets = getRowsSetsFromGrid(grid);
      let squaresSets = getSquaresSetsFromGrid(grid);

      let squaresSetIndice = Math.floor(column / 3) + Math.floor(row / 3) * 3;

      const squaresSet = squaresSets[squaresSetIndice];
      const rowSet = rowsSets[row];
      const columnSet = columnsSets[column];

      if (decimalSetHasNumber(columnSet, value)) {
        error += " already in column, ";
      }

      if (decimalSetHasNumber(rowSet, value)) {
        error += " already in row, ";
      }

      if (decimalSetHasNumber(squaresSet, value)) {
        error += " already in square";
      }

      setInfo(error);
    } else {
      setInfo("");
    }

    let copy = [...grid];
    copy[row][column] = value;
    setGrid(copy);
  };

  const onGridItemClick = (row: number, column: number) => {
    let possibilitiesTemp = listOfPossibilityForSpecificSpot(grid, row, column);

    setPossibilities(possibilitiesTemp);

    let copy = [row, column];
    setItemSelected(copy);
  };

  const enterValueForSelectedItem = (value: number) => {
    onGridItemChange(value, itemSelected[0], itemSelected[1]);
  };

  return (
    <StyledGrid>
      <div className="left">
        <StyledSudokuGrid>
          {displayGrid(grid, onGridItemChange, onGridItemClick, itemSelected)}
        </StyledSudokuGrid>
      </div>
      <div className="right">
        {possibilities.map((possibility) => {
          return (
            <button
              key={`possibility-${possibility}`}
              onClick={() => {
                enterValueForSelectedItem(possibility);
              }}
            >
              {possibility}
            </button>
          );
        })}
        <button
          onClick={() => {
            const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

            setHint(`${i + 1} ${j + 1} ${possibilities}`);

            setItemSelected([i, j]);
            onGridItemClick(i, j);
          }}
        >
          Hint
        </button>

        <button
          onClick={() => {
            const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

            if (i !== -1 && j !== -1) {
              setItemSelected([i, j]);

              onGridItemChange(possibilities[0], i, j);
            }
          }}
        >
          Solve One
        </button>

        <button
          onClick={async () => {
            for (let index = 0; index < 89; index++) {
              await new Promise((r) => setTimeout(r, 50));

              const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

              if (i !== -1 && j !== -1) {
                setItemSelected([i, j]);

                if (possibilities.length === 0) {
                  setInfo("Grid is wrong");
                  break;
                } else if (possibilities.length !== 1) {
                  setInfo("More than one solution");
                  break;
                } else {
                  onGridItemChange(possibilities[0], i, j);
                }
              } else {
                break;
              }
            }
          }}
        >
          Solve All
        </button>
        {hint}
        {info}
      </div>
    </StyledGrid>
  );
};

export default Grid;

function displayGrid(
  grid: GridType,
  onChange: (value: number, row: number, column: number) => void,
  onClick: (row: number, column: number) => void,
  itemSelected: number[]
) {
  return grid.map((row, i) => {
    return row.map((number, j) => {
      return (
        <GridItem
          selected={
            itemSelected && i === itemSelected[0] && j === itemSelected[1]
          }
          key={`${i}${j}`}
          number={number}
          row={i}
          column={j}
          onChange={onChange}
          onClick={onClick}
        />
      );
    });
  });
}
