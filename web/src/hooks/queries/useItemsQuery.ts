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

const itemsSearchQueryWhere = graphql(`
  query ItemsSearchWhere($keywords: String!, $skip: Int, $where: Item_filter, $first: Int) {
    itemSearch(text: $keywords, first: $first, skip: $skip, where: $where) {
      ...ItemDetails
    }
  }
`);

const itemsSearchQuery = graphql(`
  query ItemsSearch($keywords: String!, $skip: Int, $first: Int) {
    itemSearch(text: $keywords, first: $first, skip: $skip) {
      ...ItemDetails
    }
  }
`);

export const useItemsQuery = (
  skip = 0,
  first = 3,
  where?: Item_Filter,
  sortOrder?: OrderDirection,
  keywords?: string | null
) => {
  const { graphqlBatcher } = useGraphqlBatcher();

  const gqlDocument = keywords
    ? isUndefined(where)
      ? itemsSearchQuery
      : itemsSearchQueryWhere
    : isUndefined(where)
    ? itemsQuery
    : itemsQueryWhere;

  return useQuery<{ items: ItemDetailsFragment[] }>({
    queryKey: [`useItemsQuery`, skip, where, sortOrder, first, keywords],
    queryFn: async () => {
      const result = await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: gqlDocument,
        variables: {
          first,
          skip,
          where,
          orderDirection: sortOrder ?? "desc",
          keywords,
        },
      });

      return keywords ? { items: [...result.itemSearch] } : result;
    },
  });
};
