import React from "react";
import styled, { Theme } from "styled-components";
import { Status } from "consts/status";
import ChainIcon from "../ChainIcon";

const Container = styled.div<{ status: Status; isList: boolean }>`
  height: ${({ isList }) => (isList ? "min-content" : "45px")};
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
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
  ${({ theme, status, isList }) => {
    const [frontColor, backgroundColor] = getStatusColor(status, theme);
    return `
      ${!isList && `border-top: 5px solid ${frontColor}`};
      ${!isList && `background-color: ${backgroundColor}`};
      ${isList && `padding: 0px`};
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

interface IStatusBanner {
  status: Status;
  chainId?: number;
  isList?: boolean;
}

const getStatusColor = (status: Status, theme: Theme): [string, string] => {
  switch (status) {
    case Status.Pending:
      return [theme.primaryBlue, theme.mediumBlue];
    case Status.Disputed:
      return [theme.secondaryPurple, theme.mediumPurple];
    case Status.Included:
      return [theme.success, theme.successLight];
    default:
      return [theme.primaryBlue, theme.mediumBlue];
  }
};

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case Status.Pending:
      return "Pending";
    case Status.Disputed:
      return "Disputed";
    case Status.Included:
      return "Included";
    default:
      return "Pending";
  }
};

const StatusBanner: React.FC<IStatusBanner> = ({ status, chainId, isList = false }) => (
  <Container {...{ status, isList }}>
    <label className="front-color dot">{getStatusLabel(status)}</label>
    {!isList && <ChainIcon chainId={chainId ?? 1} />}
  </Container>
);

export default StatusBanner;
