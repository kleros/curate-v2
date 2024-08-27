import { graphql } from "src/graphql";
import { ItemDetailsQuery, RegistryItemsQuery } from "src/graphql/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
export type { ItemDetailsQuery };

export const registryItemsQuery = graphql(`
  query RegistryItems($registryId: Bytes!, $first: Int, $skip: Int) {
    items(where: { registryAddress: $registryId }, orderBy: latestRequestSubmissionTime, first: $first, skip: $skip) {
      id
      status
      disputed
      props {
        label
        description
        value
        isIdentifier
        type
      }
    }
  }
`);

export const useRegistryItemsQuery = (id?: string) => {
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery<RegistryItemsQuery["items"]>({
    queryKey: ["registryItemsQuery", id],
    // only fetch when download button clicked
    enabled: false,
    queryFn: async () => {
      let allData: RegistryItemsQuery["items"] = [];
      const first = 1000;
      let skip = 0;
      let keepFetching = true;

      try {
        while (keepFetching) {
          const data = await graphqlBatcher.fetch({
            id: crypto.randomUUID(),
            document: registryItemsQuery,
            variables: { registryId: id, first, skip },
          });

          allData = allData.concat(data.items);

          // If less than 1000 items are returned, we have reached the end
          if (data.items.length < first) {
            keepFetching = false;
          }

          skip += first;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      return allData;
    },
  });
};
