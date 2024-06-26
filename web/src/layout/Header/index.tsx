import React from "react";
import styled, { useTheme } from "styled-components";

import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import { StatusBanner } from "subgraph-status";
import { getGraphqlUrl } from "utils/getGraphqlUrl";

const Container = styled.div`
  position: sticky;
  z-index: 30;
  top: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.primaryPurple};

  display: flex;
  flex-wrap: wrap;
`;

const HeaderContainer = styled.div`
  width: 100%;
  padding: 4px 24px 8px;
`;

export const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
`;

const StyledBanner = styled(StatusBanner)`
  position: sticky !important;
  .status-text {
    h2 {
      margin: 0;
      line-height: 24px;
    }
  }
`;

const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <Container>
      <StyledBanner
        theme={{
          colors: {
            main: theme.whiteBackground,
            primary: theme.primaryText,
            secondary: theme.secondaryText,
          },
        }}
        subgraphs={[
          { name: "Curate", url: getGraphqlUrl(false) },
          { name: "Kleros Core", url: getGraphqlUrl(true) },
        ]}
      />
      <HeaderContainer>
        <DesktopHeader />
        <MobileHeader />
      </HeaderContainer>
    </Container>
  );
};

export default Header;
