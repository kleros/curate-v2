import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { OrderDirection, Item_Filter, ItemDetailsFragment } from "src/graphql/graphql";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { isUndefined } from "utils/index";
export type { ItemDetailsFragment };

export const itemFragment = graphql(`
  fragment ItemDetails on Item {
    id
    status
    props {
      type
      label
      description
      isIdentifier
      value
    }
    disputed
    registerer {
      id
    }
  }
`);

const itemsQueryWhere = graphql(`
  query ItemsPageWhere($skip: Int, $where: Item_filter, $orderDirection: OrderDirection, $first: Int) {
    items(
      first: $first
      skip: $skip
      orderBy: latestRequestSubmissionTime
      orderDirection: $orderDirection
      where: $where
    ) {
      ...ItemDetails
    }
  }
`);

const itemsQuery = graphql(`
  query ItemsPage($skip: Int, $orderDirection: OrderDirection, $first: Int) {
    items(first: $first, skip: $skip, orderBy: latestRequestSubmissionTime, orderDirection: $orderDirection) {
      ...ItemDetails
    }
  }
`);

export const useItemsQuery = (skip = 0, first = 3, where?: Item_Filter, sortOrder?: OrderDirection) => {
  const { graphqlBatcher } = useGraphqlBatcher();

  return useQuery({
    queryKey: [`useItemsQuery`, skip, where, sortOrder, first],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: isUndefined(where) ? itemsQuery : itemsQueryWhere,
        variables: {
          first,
          skip,
          where,
          orderDirection: sortOrder ?? "desc",
        },
      }),
  });
};
