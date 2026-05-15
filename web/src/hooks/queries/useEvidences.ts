import { useQuery } from "@tanstack/react-query";

import { useGraphqlBatcher } from "context/GraphqlBatcher";

import { graphql } from "src/graphql";
import { type EvidencesQuery } from "src/graphql/graphql";

const evidencesQuery = graphql(`
  query Evidences($disputeID: String) {
    evidences(where: { dispute: $disputeID }, orderBy: timestamp, orderDirection: asc, first: 2) {
      evidence
      timestamp
      name
      description
      fileURI
    }
  }
`);

export const useEvidences = (disputeID?: string) => {
  const isEnabled = disputeID !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery<EvidencesQuery>({
    queryKey: [`evidencesQuery${disputeID}`],
    enabled: isEnabled,
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: evidencesQuery,
        variables: { disputeID: disputeID?.toString() },
        isCore: true,
      }),
  });
};
