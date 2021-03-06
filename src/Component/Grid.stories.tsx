import React from "react";
import styled from "styled-components";

import Grid from "./Grid";

const StyledGrid = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const GridStory = () => (
  <StyledGrid>
    <Grid />
  </StyledGrid>
);

export default {
  title: "Grid",
  component: GridStory,
};
