import React from "react";
import styled from "styled-components";

import Grid2 from "./Grid2";

const StyledGrid2 = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const GridStory = () => (
  <StyledGrid2>
    <Grid2 />
  </StyledGrid2>
);

export default {
  title: "Grid2",
  component: GridStory,
};
