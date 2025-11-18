import { Card, CustomTimeline } from "@kleros/ui-components-library";
import React, { useMemo } from "react";
import Header from "./Header";
import { useItemRequests } from "queries/useRequestsQuery";
import { RequestDetailsFragment, Ruling, Status } from "src/graphql/graphql";
import { formatDate } from "utils/date";
import CheckIcon from "assets/svgs/icons/check-circle-outline.svg";
import ClosedIcon from "assets/svgs/icons/close-circle.svg";
import { HistorySkeletonCard } from "../StyledSkeleton";
import Party from "./Party";
import clsx from "clsx";
import { useTheme } from "~src/hooks/useToggleThemeContext";

interface IHistory {
  itemId: string;
  isItem?: boolean;
}

type TimelineItem = React.ComponentProps<typeof CustomTimeline>["items"][number];

const History: React.FC<IHistory> = ({ itemId, isItem }) => {
  const { data, isLoading } = useItemRequests(itemId);
  const [theme] = useTheme();
  const isLightTheme = theme === "light";

  const items = useMemo(
    () =>
      data?.requests.reduce<TimelineItem[]>((acc, request) => {
        const history = constructItemsFromRequest(request, isLightTheme, isItem);
        acc.push(...history);
        return acc;
      }, []),
    [data, isLightTheme, isItem]
  );

  const Component = useMemo(() => {
    if (!items || isLoading) return <HistorySkeletonCard />;
    else if (items.length === 0) return <label className="self-center pb-8">No requests yet.</label>;

    return <CustomTimeline className={clsx("w-full mb-8", "[&_h2]:m-0 [&_div]:max-h-none")} {...{ items }} />;
  }, [items, isLoading]);

  return (
    <Card className="flex flex-col w-full h-auto items-start gap-14 py-6 px-8">
      <Header />
      {Component}
    </Card>
  );
};

const constructItemsFromRequest = (
  request: RequestDetailsFragment,
  isLightTheme: boolean,
  isItem?: boolean
): TimelineItem[] => {
  const historyItems: TimelineItem[] = [];

  if (request.requestType === Status.RegistrationRequested) {
    historyItems.push({
      title: `${isItem ? "Item" : "List"} Submitted`,
      variant: isLightTheme ? "#009aff" : "#6cc5ff",
      subtitle: formatDate(request.submissionTime),
      rightSided: true,
      party: "",
    });

    if (request.disputed && request.challenger) {
      historyItems.push({
        title: `${isItem ? "Submission" : "Registration"} Challenged - Case ${request.disputeID}`,
        variant: isLightTheme ? "#9013fe" : "#b45fff",
        party: <Party {...{ request }} />,
        subtitle: formatDate(request.challengeTime),
        rightSided: true,
      });
    }

    if (request.resolved) {
      const included = request.disputed && request.finalRuling === Ruling.Reject ? false : true;

      historyItems.push({
        title: `${isItem ? "Item" : "List"} ${included ? "Included" : "Rejected"}`,
        variant: included ? (isLightTheme ? "#009aff" : "#6cc5ff") : isLightTheme ? "#f60c36" : "#ff5a78",
        subtitle: formatDate(request.resolutionTime),
        rightSided: true,
        party: "",
        Icon: included ? CheckIcon : ClosedIcon,
      });
    }
  } else if (request.requestType === Status.ClearingRequested) {
    historyItems.push({
      title: "Removal Requested",
      variant: isLightTheme ? "#009aff" : "#6cc5ff",
      subtitle: formatDate(request.submissionTime),
      rightSided: true,
      party: <Party {...{ request }} isRemoval />,
    });

    if (request.disputed && request.challenger) {
      historyItems.push({
        title: `Removal Challenged - Case ${request.disputeID}`,
        variant: isLightTheme ? "#9013fe" : "#b45fff",
        party: <Party {...{ request }} />,
        subtitle: formatDate(request.submissionTime),
        rightSided: true,
      });
    }
    if (request.resolved) {
      const removed = request.disputed ? request.finalRuling === Ruling.Accept : request.finalRuling === null;
      historyItems.push({
        title: `${isItem ? "Item" : "List"} ${removed ? "Removed" : "Included"}`,
        variant: removed ? (isLightTheme ? "#f60c36" : "#ff5a78") : isLightTheme ? "#00c42b" : "#65dc7f",
        subtitle: formatDate(request.resolutionTime),
        rightSided: true,
        party: "",
        Icon: removed ? ClosedIcon : CheckIcon,
      });
    }
  }

  return historyItems;
};

export default History;
