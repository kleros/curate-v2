import { useQuery } from "@tanstack/react-query";

import { useGraphqlBatcher } from "context/GraphqlBatcher";

import { graphql } from "src/graphql";
import { type EvidencesQuery } from "src/graphql/graphql";

const evidencesQuery = graphql(`
  query Evidences($evidenceGroupID: String) {
    evidences(where: { evidenceGroup: $evidenceGroupID }, orderBy: timestamp, orderDirection: asc, first: 2) {
      evidence
      timestamp
      name
      description
      fileURI
    }
  }
`);

export const useEvidences = (evidenceGroup?: string) => {
  const isEnabled = evidenceGroup !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery<EvidencesQuery>({
    queryKey: [`evidencesQuery${evidenceGroup}`],
    enabled: isEnabled,
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: evidencesQuery,
        variables: { evidenceGroupID: evidenceGroup?.toString() },
        isCore: true,
      }),
  });
};
