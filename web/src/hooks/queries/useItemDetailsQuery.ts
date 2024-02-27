import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { ItemDetailsQuery } from "src/graphql/graphql";
export type { ItemDetailsQuery };

const itemDetailsQuery = graphql(`
  query ItemDetails($itemID: ID!) {
    item(id: $itemID) {
      status
      disputed
      latestChallenger
      latestRequester
      registryAddress
      props {
        type
        label
        description
        isIdentifier
        value
      }
    }
  }
`);

export const useItemDetailsQuery = (id?: string | number) => {
  const isEnabled = id !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery({
    queryKey: ["refetchOnBlock", `itemDetailsQuery${id}`],
    enabled: isEnabled,
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: itemDetailsQuery,
        variables: { itemID: id?.toString() },
      }),
  });
};
