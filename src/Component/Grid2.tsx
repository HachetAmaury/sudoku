import React from "react";
import styled from "styled-components";

import { GridType } from "../sudokuLib/utils";

const StyledGrid = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  border: 1px solid black;
  font-size: 3vmax;

  .border-bottom {
    border-bottom: 2px solid black;
  }

  .border-right {
    border-right: 2px solid black;
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

const Grid2 = () => {
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

  return <StyledGrid className="grid">{displayGrid(grid)}</StyledGrid>;
};

export default Grid2;

function displayGrid(grid: GridType) {
  const borderBottom = (i: number, j: number) => {
    return i % 3 === 2;
  };

  const borderRight = (i: number, j: number) => {
    return j % 3 === 2;
  };

  const getClasses = (i: number, j: number) => {
    let classes = borderBottom(i, j) ? "border-bottom " : "";

    classes = borderRight(i, j) ? (classes += "border-right ") : classes + "";

    return classes;
  };

  return grid.map((row, i) => {
    return row.map((number, j) => {
      return (
        <StyledGridItem className={getClasses(i, j)}>{number}</StyledGridItem>
      );
    });
  });
}
