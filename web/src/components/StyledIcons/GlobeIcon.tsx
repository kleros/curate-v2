import styled from "styled-components";
import Globe from "svgs/chains/globe.svg";

export const StyledGlobeIcon = styled(Globe)`
  path {
    fill: ${({ theme }) => theme.primaryText};
  }
  margin-right: 8px;
`;
