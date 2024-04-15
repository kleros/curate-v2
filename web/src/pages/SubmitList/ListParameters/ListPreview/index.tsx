import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import ListPageDisplay from "./ListPageDisplay";
import HomePageDisplay from "./HomePageDisplay";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-top: 24px;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px dashed ${({ theme }) => theme.primaryBlue};
  background-color: ${({ theme }) => theme.mediumBlue};
  height: auto;
  min-height: 100px;
  margin-bottom: ${responsiveSize(0, 16)};
  padding: ${responsiveSize(24, 48)} ${responsiveSize(24, 32)};
  gap: 32px;
  position: relative;
`;

const Header = styled.h2`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.secondaryPurple};
  margin-bottom: 0px;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;
const ListPreview: React.FC = () => {
  return (
    <Container>
      <Header>Preview</Header>
      <StyledCard>
        <HomePageDisplay />
        <ListPageDisplay />
        <Overlay />
      </StyledCard>
    </Container>
  );
};

export default ListPreview;
