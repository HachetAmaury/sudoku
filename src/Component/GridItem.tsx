import React from "react";
import styled from "styled-components";

const StyledGridItem = styled.div`
  width: 100%;
  justify-content: center;
  text-align: center;
  margin: auto;

  input {
    max-width: 5vw;
    max-height: 5vw;
    height: 5vw;
    font-size: 2.5em;
    text-align: center;
  }

  .selected {
    background-color: lightgray;
  }
`;
interface GridItemProps {
  number: number;
  row: number;
  column: number;
  possibilities?: number[];
  onChange: (value: number, row: number, column: number) => void;
  onClick: (row: number, column: number) => void;
  selected: boolean;
}

const GridItem = ({
  number,
  row,
  column,
  onChange,
  onClick,
  selected,
}: GridItemProps) => {
  return (
    <StyledGridItem>
      <input
        className={selected ? "selected" : ""}
        maxLength={1}
        value={number ? number : ""}
        onChange={(event) => {
          console.log(event.target.value);
          onChange(
            parseInt(event.target.value ? event.target.value : "0"),
            row,
            column
          );
        }}
        onClick={() => {
          onClick(row, column);
        }}
      />
    </StyledGridItem>
  );
};

export default GridItem;
