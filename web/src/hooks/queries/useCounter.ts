import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { CounterQuery } from "~src/graphql/graphql";

const counterQuery = graphql(`
  query Counter {
    counter(id: "0") {
      totalRegistries
      totalItems
      totalDeposits
      numberOfCurators
    }
  }
`);

export const useCounter = () => {
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery<CounterQuery>({
    queryKey: ["refetchOnBlock", `counterQuery`],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: counterQuery,
        variables: {},
      }),
  });
};
