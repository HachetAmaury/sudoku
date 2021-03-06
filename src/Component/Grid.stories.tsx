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
