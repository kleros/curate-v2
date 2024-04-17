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
      key0
      key1
      key2
      key3
      key4
      latestChallenger {
        id
      }
      latestRequester {
        id
      }
      props {
        type
        label
        description
        isIdentifier
        value
      }
      registerer {
        id
      }
    }
  }
`);

export const useItemDetailsQuery = (id?: string | number) => {
  const isEnabled = id !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery<ItemDetailsQuery>({
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
