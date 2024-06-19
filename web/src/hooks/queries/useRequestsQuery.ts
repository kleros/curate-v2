import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { RequestDetailsFragment } from "src/graphql/graphql";

export const requestDetailsFragment = graphql(`
  fragment RequestDetails on Request {
    id
    disputed
    disputeID
    externalDisputeID
    submissionTime
    resolved
    requester {
      id
    }
    challenger {
      id
    }
    item {
      itemID
      status
      registryAddress
    }
    arbitrator
    arbitratorExtraData
    deposit
    disputeOutcome
    requestType
    resolutionTime
    finalRuling
    creationTx
    resolutionTx
    challengeTime
  }
`);

const requestQuery = graphql(`
  query ItemRequests($id: ID!) {
    item(id: $id) {
      requests {
        ...RequestDetails
      }
    }
  }
`);

export const useItemRequests = (id?: string | number) => {
  const isEnabled = id !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery<{ requests: RequestDetailsFragment[] }>({
    queryKey: ["refetchOnBlock", `requestsQuery${id}`],
    enabled: isEnabled,
    queryFn: async () =>
      (
        await graphqlBatcher.fetch({
          id: crypto.randomUUID(),
          document: requestQuery,
          variables: { id },
        })
      )?.item,
  });
};
