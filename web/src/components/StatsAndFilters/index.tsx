import React from "react";
import styled from "styled-components";
import Stats, { IStats } from "./Stats";
import Filters, { IFilters } from "./Filters";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 11px;
  margin-bottom: 48px;
  justify-content: space-between;
`;

const StatsAndFilters: React.FC<IStats & IFilters> = ({ fields, isListFilter }) => (
  <Container>
    <Stats {...{ fields }} />
    <Filters {...{ isListFilter }} />
  </Container>
);

export default StatsAndFilters;
