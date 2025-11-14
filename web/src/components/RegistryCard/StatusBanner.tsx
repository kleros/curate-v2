import React from "react";
import { Status } from "consts/status";
import { Status as SubgraphStatus } from "src/graphql/graphql";
import { cn } from "~src/utils";

interface IStatusBanner {
  status: Status;
  isListView?: boolean;
}

export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case Status.RegistrationPending:
      return "Registration Pending";
    case Status.ClearingPending:
      return "Clearing Pending";
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
    case SubgraphStatus.Absent:
      return Status.Removed;
    case SubgraphStatus.Registered:
      return Status.Included;
    case SubgraphStatus.RegistrationRequested:
      return Status.RegistrationPending;
    default:
      return Status.ClearingPending;
  }
};

const borderAndBgStyles: Record<Status, string> = {
  [Status.RegistrationPending]: "border-t-klerosUIComponentsPrimaryBlue bg-klerosUIComponentsMediumBlue",
  [Status.ClearingPending]: "border-t-klerosUIComponentsPrimaryBlue bg-klerosUIComponentsMediumBlue",
  [Status.Disputed]: "border-t-klerosUIComponentsSecondaryPurple bg-klerosUIComponentsMediumPurple",
  [Status.Included]: "border-t-klerosUIComponentsSuccess bg-klerosUIComponentsSuccessLight",
  [Status.Removed]: "border-t-klerosUIComponentsError bg-klerosUIComponentsErrorLight",
};

const dotAndFrontColorStyles: Record<Status, string> = {
  [Status.RegistrationPending]:
    "[&_.front-color]:text-klerosUIComponentsPrimaryBlue [&_.dot::before]:bg-klerosUIComponentsPrimaryBlue",
  [Status.ClearingPending]:
    "[&_.front-color]:text-klerosUIComponentsPrimaryBlue [&_.dot::before]:bg-klerosUIComponentsPrimaryBlue",
  [Status.Disputed]:
    "[&_.front-color]:text-klerosUIComponentsSecondaryPurple [&_.dot::before]:bg-klerosUIComponentsSecondaryPurple",
  [Status.Included]: "[&_.front-color]:text-klerosUIComponentsSuccess [&_.dot::before]:bg-klerosUIComponentsSuccess",
  [Status.Removed]: "[&_.front-color]:text-klerosUIComponentsError [&_.dot::before]:bg-klerosUIComponentsError",
};

const StatusBanner: React.FC<IStatusBanner> = ({ status, isListView = false }) => (
  <div
    className={cn(
      "flex items-center justify-between px-6 rounded-t-[3px]",
      isListView ? "h-min" : "h-11",
      isListView && "p-0",
      !isListView && ["border-t-[5px]", borderAndBgStyles[status]],
      "[&_.dot::before]:content-[''] [&_.dot::before]:inline-block [&_.dot::before]:h-2 [&_.dot::before]:w-2 [&_.dot::before]:rounded-[50%] [&_.dot::before]:mr-2",
      dotAndFrontColorStyles[status]
    )}
  >
    <label className="front-color dot">{getStatusLabel(status)}</label>
  </div>
);

export default StatusBanner;
