import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { RegistryDetailsQuery } from "src/graphql/graphql";

export const registryDetailsQuery = graphql(`
  query RegistryDetails($id: ID!) {
    registry(id: $id) {
      id
      title
      logoURI
      policyURI
      description
      totalItems
      numberOfAbsent
      numberOfPending
      numberOfRegistered
      numberOfDisputed
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
      fieldProps {
        label
        description
        type
        isIdentifier
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

  return useQuery<RegistryDetailsQuery>({
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
