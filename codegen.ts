import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_SERVER_URL,
  documents: ["./src/graphql/**/*.graphql"],
  generates: {
    "./src/graphql/schema.json": {
      plugins: ["introspection"],
    },
    "./src/generated/output.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        scalars: {
          DateTime: "string",
        },
        apolloReactCommonImportFrom: "@apollo/client",
        apolloReactHooksImportFrom: "@apollo/client/react",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
