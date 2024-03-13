import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../NavigationButtons";
import { AlertMessage, Card } from "@kleros/ui-components-library";
import Progress from "./Progress";
import ListDetails from "./ListDetails";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 0px ${responsiveSize(0, 108)};
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: max-content;
`;

const AlertMessageContainer = styled.div`
  svg {
    flex-shrink: 0;
  }
`;
const DeployList: React.FC = () => {
  return (
    <Container>
      <StyledCard>
        <ListDetails />
        <Progress />
      </StyledCard>
      <AlertMessageContainer>
        <AlertMessage
          variant="warning"
          title="Almost Ready!"
          msg="Creating a list requires 2 transactions. The total cost at the moment is approximately 0.03 ETH. We recommend that you familiarize yourself with all the parameters to avoid mistakes. When you are ready, click on Create List."
        />
      </AlertMessageContainer>
      <NavigationButtons prevRoute="/submitList/advanced" />
    </Container>
  );
};
export default DeployList;
