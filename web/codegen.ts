import type { CodegenConfig } from "@graphql-codegen/cli";
import { graphqlUrl } from "utils/graphqlQueryFnHelper";

const config: CodegenConfig = {
  overwrite: true,
  schema: [graphqlUrl()],
  documents: "./src/hooks/queries/*.ts",
  generates: {
    "./src/graphql/": {
      preset: "client",
    },
  },
};

export default config;
