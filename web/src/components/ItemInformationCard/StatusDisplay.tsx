import React from "react";
import { getStatusColor, getStatusLabel, mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import styled from "styled-components";
import { Status } from "consts/status";
import { Status as SubgraphStatus } from "src/graphql/graphql";

const StatusContainer = styled.div<{ status: Status; isList: boolean }>`
  display: flex;
  margin-top: 16px;
  .dot {
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  ${({ theme, status }) => {
    const [frontColor] = getStatusColor(status, theme);
    return `
      .front-color {
        color: ${frontColor};
      }
      .dot {
        ::before {
          background-color: ${frontColor};
        }
      }
    `;
  }};
`;
interface IStatusDisplay {
  status: SubgraphStatus;
  disputed: boolean;
}
const StatusDisplay: React.FC<IStatusDisplay> = ({ status, disputed }) => {
  return (
    <StatusContainer {...{ status: mapFromSubgraphStatus(status, disputed), isList: false }}>
      <label className="front-color dot">{getStatusLabel(mapFromSubgraphStatus(status, disputed))}</label>
    </StatusContainer>
  );
};

export default StatusDisplay;
