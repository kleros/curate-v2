import { GetRegistriesByIdsQuery } from "src/graphql/graphql";

/**
 *
 * @param registryIds Array containing registry ids
 * @param registries Array containing registry objects to be sorted
 * @returns An array of Registries matching the order of registryIds
 */
export const sortRegistriesByIds = (registryIds: string[], registries: GetRegistriesByIdsQuery["registries"]) => {
  const idToIndexMap = {};
  registryIds.forEach((id, index) => {
    idToIndexMap[id] = index;
  });

  registries.sort((a, b) => idToIndexMap[a.id] - idToIndexMap[b.id]);
  return registries;
};
