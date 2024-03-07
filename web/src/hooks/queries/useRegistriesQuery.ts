import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { OrderDirection, Registry_Filter } from "src/graphql/graphql";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { isUndefined } from "utils/index";

export const registryFragment = graphql(`
  fragment RegistryDetails on Registry {
    id
    items {
      itemID
      data
      status
      numberOfRequests
      registerer {
        id
      }
      latestChallenger {
        id
      }
    }
    registerer {
      id
    }
  }
`);

export const counterFragment = graphql(`
  fragment CounterFragment on Counter {
    totalItems
    totalDeposits
    totalRegistries
  }
`);

const registriesQueryWhere = graphql(`
  query RegistriesPageWhere($skip: Int, $where: Registry_filter, $orderDirection: OrderDirection, $first: Int) {
    registries(first: $first, skip: $skip, orderDirection: $orderDirection, where: $where) {
      ...RegistryDetails
    }
  }
`);

const registriesQuery = graphql(`
  query RegistriesPage($skip: Int, $orderDirection: OrderDirection, $first: Int) {
    registries(first: $first, skip: $skip, orderDirection: $orderDirection) {
      ...RegistryDetails
    }
  }
`);

const counterQuery = graphql(`
  query CounterDetails($id: ID!) {
    counter(id: $id) {
      ...CounterFragment
    }
  }
`);

export const useRegistriesQuery = (skip = 0, first = 3, where?: Registry_Filter, sortOrder?: OrderDirection) => {
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery({
    queryKey: ["useRegistriesQuery", skip, where, sortOrder, first],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: isUndefined(where) ? registriesQuery : registriesQueryWhere,
        variables: {
          first,
          skip,
          where,
          orderDirection: sortOrder ?? "desc",
        },
      }),
  });
};

export const useCounterQuery = () => {
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery({
    queryKey: ["useCounterQuery"],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: counterQuery,
        variables: { id: "0" },
      }),
  });
};
