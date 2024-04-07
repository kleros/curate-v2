import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import NavigationButtons from "../../NavigationButtons";
import ListDisplay from "./ListDisplay";
import ItemDisplay from "./ItemDisplay";

const Container = styled.div`
  width: 100%;
  padding: 0px ${responsiveSize(10, 130)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
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

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Header = styled.h2`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.secondaryPurple};
`;

const ItemPreview: React.FC = () => {
  return (
    <Container>
      <Header>Item Preview</Header>
      <StyledCard>
        <ListDisplay />
        <ItemDisplay />
        <Overlay />
      </StyledCard>
      <NavigationButtons prevRoute="/submitList/fields" nextRoute="/submitList/custom" />
    </Container>
  );
};

export default ItemPreview;
