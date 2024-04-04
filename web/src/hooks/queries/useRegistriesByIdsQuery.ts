import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";

export const registriesByIdsQuery = graphql(`
  query GetRegistriesByIds($ids: [ID!]!) {
    registries(where: { id_in: $ids }) {
      id
      title
      logoURI
      description
      items {
        id
      }
    }
  }
`);

export const useRegistriesByIdsQuery = (ids) => {
  const isEnabled = ids.length > 0;
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery({
    queryKey: ["GetRegistriesByIds", ids.join(",")],
    enabled: isEnabled,
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: registriesByIdsQuery,
        variables: { ids },
      }),
  });
};
