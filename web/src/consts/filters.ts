import { Item_Filter, Status } from "src/graphql/graphql";

const keys = ["Pending", "Disputed", "Included", "Removed", "Active"] as const;

export const List_filters: Record<(typeof keys)[number], Item_Filter> = {
  Pending: { status_in: [Status.RegistrationRequested, Status.ClearingRequested], disputed: false },
  Disputed: { disputed: true },
  Included: { status: Status.Registered },
  Removed: { status: Status.Absent },
  Active: { status_not_in: [Status.Absent] },
};
