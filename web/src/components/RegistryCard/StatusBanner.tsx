import React from "react";
import styled, { Theme } from "styled-components";
import { Status } from "consts/status";
import ChainIcon from "../ChainIcon";

const Container = styled.div<{ status: Status; isListView: boolean }>`
  height: ${({ isListView }) => (isListView ? "min-content" : "45px")};
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
  ${({ theme, status, isListView }) => {
    const [frontColor, backgroundColor] = getStatusColor(status, theme);
    return `
      ${!isListView && `border-top: 5px solid ${frontColor}`};
      ${!isListView && `background-color: ${backgroundColor}`};
      ${isListView && `padding: 0px`};
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
  isListView?: boolean;
}

export const getStatusColor = (status: Status, theme: Theme): [string, string] => {
  switch (status) {
    case Status.Pending:
      return [theme.primaryBlue, theme.mediumBlue];
    case Status.Disputed:
      return [theme.secondaryPurple, theme.mediumPurple];
    case "registered":
      return [theme.success, theme.successLight];
    case Status.Removed:
      return [theme.error, theme.errorLight];
    default:
      return [theme.primaryBlue, theme.mediumBlue];
  }
};

export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case Status.Pending:
      return "Pending";
    case Status.Disputed:
      return "Disputed";
    case "registered":
      return "Included";
    case Status.Removed:
      return "Removed";
    default:
      return "Pending";
  }
};

const StatusBanner: React.FC<IStatusBanner> = ({ status, chainId, isListView = false }) => (
  <Container {...{ status, isListView }}>
    <label className="front-color dot">{getStatusLabel(status)}</label>
    {!isListView && <ChainIcon chainId={chainId ?? 1} />}
  </Container>
);

export default StatusBanner;
