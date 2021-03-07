import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as _ from "lodash";

import {
  bestSpotWithFewerPossibility,
  countNumbersInGrid,
  decimalSetHasNumber,
  getColumnsSetsFromGrid,
  getRowsSetsFromGrid,
  getSquaresSetsFromGrid,
  GridType,
  listOfPossibilityForSpecificSpot,
  resolve,
} from "../sudokuLib/utils";

const Button = styled.div`
  font-family: "champselysees";
  border-radius: 5px;
  padding: 1.5vw 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-left: auto;
  margin-right: auto; */
  margin: 5px;
  background-color: lightgray;
  width: 100%;
`;

const StyledMainContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: grid;

  @media only screen and (max-width: 800px) {
    grid-template-rows: 50% 50%;
  }

  @media only screen and (min-width: 800px) {
    grid-template-columns: 50% 50%;
  }
`;

const StyledGrid = styled.div`
  width: 100%;
  height: 100%;
  max-height: 500px;
  max-width: 500px;

  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  border: 1px solid black;
  font-size: 30px;

  .border-bottom {
    border-bottom: 2px solid black;
  }

  .border-right {
    border-right: 2px solid black;
  }

  .selected {
    background-color: lightgray;
  }
`;

const StyledGridItem = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lightgray;
`;

const StyledNumbersButtonContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
`;

// const gridWithOneSolution = [
//   [0, 3, 0, 0, 0, 1, 6, 0, 0],
//   [0, 0, 0, 0, 4, 0, 9, 0, 0],
//   [4, 0, 8, 0, 0, 0, 1, 7, 5],
//   [8, 0, 0, 0, 9, 7, 0, 2, 1],
//   [3, 1, 7, 2, 0, 6, 0, 0, 0],
//   [0, 0, 0, 1, 5, 3, 0, 0, 0],
//   [0, 4, 0, 0, 2, 0, 0, 5, 3],
//   [0, 5, 9, 0, 3, 0, 0, 0, 7],
//   [2, 0, 0, 0, 0, 0, 0, 0, 9],
// ];

// const gridWith36Solutions = [
//   [0, 0, 0, 6, 0, 0, 0, 2, 0],
//   [8, 0, 1, 0, 0, 7, 9, 0, 0],
//   [0, 0, 0, 0, 0, 4, 1, 0, 0],
//   [0, 0, 5, 0, 0, 8, 0, 0, 0],
//   [0, 2, 8, 5, 6, 0, 4, 0, 3],
//   [0, 0, 0, 0, 0, 0, 0, 8, 0],
//   [0, 0, 0, 0, 9, 0, 0, 0, 7],
//   [0, 0, 0, 7, 0, 0, 0, 1, 0],
//   [1, 5, 0, 0, 0, 0, 0, 0, 4],
// ];

const gridWith36Solutions = [
  [0, 0, 0, 6, 0, 0, 0, 0, 0],
  [8, 0, 1, 0, 0, 0, 9, 0, 0],
  [0, 0, 0, 0, 0, 4, 1, 0, 0],
  [0, 0, 5, 0, 0, 8, 0, 0, 0],
  [0, 2, 0, 5, 6, 0, 4, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 8, 0],
  [0, 0, 0, 0, 9, 0, 0, 0, 7],
  [0, 0, 0, 7, 0, 0, 0, 1, 0],
  [1, 5, 0, 0, 0, 0, 0, 0, 4],
];

const MainContainer = () => {
  // More than One solution

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

  // One solution

  const [grid, setGrid] = useState(gridWith36Solutions);

  const [selectedSpot, setSelectedSpot] = useState([-1, -1]);
  const [selectedSpotPossibilities, setSelectedSpotPossibilities] = useState([
    0,
  ]);

  const [info, setInfo] = useState("");
  const [hint, setHint] = useState("");

  const [allSolutions, setAllSolutions] = useState<GridType[]>([]);
  const [currentSolutionsNumber, setCurrentSolutionsNumber] = useState(0);
  const [numbersInGrid, setNumbersInGrid] = useState(0);

  useEffect(() => {
    const numbersInGrid = countNumbersInGrid(grid);
    setNumbersInGrid(numbersInGrid);
  }, [grid]);

  const onSpotSelected = (row: number, column: number) => {
    let possibilitiesTemp = listOfPossibilityForSpecificSpot(grid, row, column);
    setSelectedSpotPossibilities(possibilitiesTemp);

    let copy = [row, column];
    setSelectedSpot(copy);
  };

  const onNumberEntered = (number: number, row: number, column: number) => {
    let possibilitiesTemp = listOfPossibilityForSpecificSpot(grid, row, column);

    if (number !== 0 && possibilitiesTemp.indexOf(number) === -1) {
      let error = "Error ";

      let columnsSets = getColumnsSetsFromGrid(grid);
      let rowsSets = getRowsSetsFromGrid(grid);
      let squaresSets = getSquaresSetsFromGrid(grid);

      let squaresSetIndice = Math.floor(column / 3) + Math.floor(row / 3) * 3;

      const squaresSet = squaresSets[squaresSetIndice];
      const rowSet = rowsSets[row];
      const columnSet = columnsSets[column];

      if (decimalSetHasNumber(columnSet, number)) {
        error += " already in column, ";
      }

      if (decimalSetHasNumber(rowSet, number)) {
        error += " already in row, ";
      }

      if (decimalSetHasNumber(squaresSet, number)) {
        error += " already in square";
      }

      setInfo(error);
    } else {
      setInfo("");
    }

    let copy = [...grid];
    copy[row][column] = number;
    setGrid(copy);
  };

  const solveOne = () => {
    const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

    if (i !== -1 && j !== -1) {
      onSpotSelected(i, j);

      if (possibilities.length === 0) {
        setInfo("Grid is wrong");
      } else if (possibilities.length !== 1) {
        setInfo("More than one solution");
      } else {
        onNumberEntered(possibilities[0], i, j);
      }
    }
  };

  const solveAll = async () => {
    for (let index = 0; index < 89; index++) {
      await new Promise((r) => setTimeout(r, 50));

      const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

      if (i !== -1 && j !== -1) {
        onSpotSelected(i, j);

        if (possibilities.length === 0) {
          setInfo("Grid is wrong");
          break;
        } else if (possibilities.length !== 1) {
          setInfo("More than one solution");
          break;
        } else {
          onNumberEntered(possibilities[0], i, j);
        }
      } else {
        break;
      }
    }
  };

  const giveHint = () => {
    const [i, j, possibilities] = bestSpotWithFewerPossibility(grid);

    setHint(`${possibilities}`);

    onSpotSelected(i, j);
  };

  const resetGrid = () => {
    const newGrid = _.cloneDeep(gridWith36Solutions);
    setCurrentSolutionsNumber(0);
    setAllSolutions([]);
    setGrid(newGrid);
  };

  const displayWarningIfNeed = () => {
    if (numbersInGrid < 10) {
      return `Too much solutions, only ${numbersInGrid} numbers in grid`;
    } else {
      if (numbersInGrid < 25) {
        return (
          <div>
            <div>{`Many solutions, only ${numbersInGrid} numbers in grid, it might take loooong !! `}</div>

            <Button onClick={resolveAll}>Still find all the solutions</Button>
          </div>
        );
      } else {
        <Button onClick={resolveAll}>Find all the solutions</Button>;
      }
    }
  };

  const resolveAll = () => {
    const resultTemp: GridType[] = [];

    resolve(grid, resultTemp);

    if (resultTemp.length) {
      setAllSolutions(_.cloneDeep(resultTemp));
    } else {
      setInfo("GRID IS WRONG : NO solution found ");
    }
  };

  return (
    <StyledMainContainer>
      <StyledGrid>{displayGrid(grid, onSpotSelected, selectedSpot)}</StyledGrid>
      <div>
        <StyledNumbersButtonContainer>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={"key" + num}
              onClick={() =>
                onNumberEntered(num, selectedSpot[0], selectedSpot[1])
              }
            >
              {num}
            </Button>
          ))}
        </StyledNumbersButtonContainer>
        <StyledNumbersButtonContainer>
          <Button
            onClick={() => onNumberEntered(0, selectedSpot[0], selectedSpot[1])}
          >
            ERASE
          </Button>
          <Button onClick={giveHint}>Hint</Button>
          <Button onClick={solveOne}>Solve One</Button>
          <Button onClick={solveAll}>Solve All</Button>
          <Button onClick={resetGrid}>Reset Grid</Button>
        </StyledNumbersButtonContainer>
        {selectedSpotPossibilities.length
          ? "Possibilities for current spot : "
          : ""}
        <StyledNumbersButtonContainer>
          {selectedSpotPossibilities.map((possibility) => {
            return (
              <Button
                key={`possibility-${possibility}`}
                onClick={() => {
                  onNumberEntered(
                    possibility,
                    selectedSpot[0],
                    selectedSpot[1]
                  );
                }}
              >
                {possibility}
              </Button>
            );
          })}
        </StyledNumbersButtonContainer>

        <div>{info}</div>
        <div>{hint}</div>
        <div> ---------------------------------------- </div>
        <div>{numbersInGrid}</div>
        <StyledNumbersButtonContainer>
          <div>{displayWarningIfNeed()}</div>
        </StyledNumbersButtonContainer>

        <StyledNumbersButtonContainer>
          {allSolutions.length ? (
            <Button
              onClick={() => {
                if (currentSolutionsNumber !== 0) {
                  setGrid(allSolutions[currentSolutionsNumber]);
                  setCurrentSolutionsNumber(currentSolutionsNumber - 1);
                }
              }}
            >
              PREVIOUS
            </Button>
          ) : (
            ""
          )}

          {allSolutions.length ? (
            <Button
              onClick={() => {
                if (currentSolutionsNumber !== allSolutions.length - 1) {
                  setGrid(allSolutions[currentSolutionsNumber]);
                  setCurrentSolutionsNumber(currentSolutionsNumber + 1);
                }
              }}
            >
              NEXT
            </Button>
          ) : (
            ""
          )}
        </StyledNumbersButtonContainer>
        <div> ---------------------------------------- </div>
        <div>
          {allSolutions.length
            ? `${allSolutions.length} solutions found : Solution ${
                currentSolutionsNumber + 1
              }`
            : ""}
        </div>
      </div>
    </StyledMainContainer>
  );
};

function displayGrid(
  grid: GridType,
  onSpotSelected: (row: number, column: number) => void,
  selectedSpot: number[]
) {
  return grid.map((row, i) => {
    return row.map((number, j) => {
      return (
        <StyledGridItem
          key={`${i}-${j}`}
          onClick={() => onSpotSelected(i, j)}
          className={getClasses(i, j, selectedSpot)}
        >
          {number ? number : ""}
        </StyledGridItem>
      );
    });
  });
}

export default MainContainer;

const getClasses = (i: number, j: number, selectedSpot: number[]) => {
  let classes = borderBottom(i, j) ? "border-bottom " : "";

  classes = borderRight(i, j) ? (classes += "border-right ") : classes;

  classes =
    selectedSpot && i === selectedSpot[0] && j === selectedSpot[1]
      ? (classes += "selected")
      : classes;

  return classes;
};

const borderBottom = (i: number, j: number) => {
  return i % 3 === 2;
};

const borderRight = (i: number, j: number) => {
  return j % 3 === 2;
};
