import React from "react";
import styled, { Theme } from "styled-components";
import { Status } from "consts/status";

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
  isListView?: boolean;
}

export const getStatusColor = (status: Status, theme: Theme): [string, string] => {
  switch (status) {
    case Status.Pending:
      return [theme.primaryBlue, theme.mediumBlue];
    case Status.Disputed:
      return [theme.secondaryPurple, theme.mediumPurple];
    case Status.Included:
      return [theme.success, theme.successLight];
    case Status.Removed:
      return [theme.error, theme.errorLight];
    default:
      return [theme.lightGrey, theme.lightGrey];
  }
};

export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case Status.Pending:
      return "Pending";
    case Status.Disputed:
      return "Disputed";
    case Status.Included:
      return "Included";
    case Status.Removed:
      return "Removed";
    default:
      return "";
  }
};
// in subgraph the Statuses are mapped according to Contracts, for Fronted we need different
export const mapFromSubgraphStatus = (status: string, isDisputed: boolean) => {
  if (isDisputed) return Status.Disputed;
  switch (status) {
    case "absent":
      return Status.Removed;
    case "registered":
      return Status.Included;
    default:
      return Status.Pending;
  }
};
const StatusBanner: React.FC<IStatusBanner> = ({ status, isListView = false }) => (
  <Container {...{ status, isListView }}>
    <label className="front-color dot">{getStatusLabel(status)}</label>
  </Container>
);

export default StatusBanner;
