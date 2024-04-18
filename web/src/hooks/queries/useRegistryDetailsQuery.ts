import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";

export const registryDetailsQuery = graphql(`
  query RegistryDetails($id: ID!) {
    registry(id: $id) {
      title
      logoURI
      policyURI
      description
      items {
        id
        status
        props {
          label
          description
          value
          isIdentifier
          type
        }
        key0
        key1
      }
      registerer {
        id
      }
    }
  }
`);

export const useRegistryDetailsQuery = (id?: string | number) => {
  const isEnabled = id !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery({
    queryKey: ["refetchOnBlock", `registryDetailsQuery${id}`],
    enabled: isEnabled,
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: registryDetailsQuery,
        variables: { id },
      }),
  });
};
