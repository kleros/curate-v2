import { graphql } from "src/graphql";
import { CourtTreeQuery } from "src/graphql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { getGraphqlUrl } from "utils/getGraphqlUrl";
export type { CourtTreeQuery };

const courtTreeQuery = graphql(`
  query CourtTree {
    court(id: "1") {
      name
      id
      children(orderBy: name) {
        name
        id
        children {
          name
          id
          children {
            name
            id
            children {
              name
              id
              children {
                name
                id
              }
            }
          }
        }
      }
    }
  }
`);

export const useCourtTree = () => {
  const url = getGraphqlUrl(true);
  return useQuery<CourtTreeQuery>({
    queryKey: ["courtTreeQuery"],
    queryFn: async () => await request(url, courtTreeQuery, {}),
    staleTime: Infinity,
  });
};

interface IItem {
  id: string;
  label: string;
  itemValue: string;
  children?: IItem[];
}

export const rootCourtToItems = (
  court: NonNullable<CourtTreeQuery["court"]>,
  value: "id" | "path" = "path"
): IItem => ({
  id: value === "id" ? court.id : `/courts/${court.id}`,
  label: court.name ? court.name : "Unnamed Court",
  itemValue: value === "id" ? court.id : `/courts/${court.id}`,
  children: court.children.length > 0 ? court.children.map((child) => rootCourtToItems(child, value)) : undefined,
});
