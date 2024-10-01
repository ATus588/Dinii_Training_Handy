import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotevn from 'dotenv'
dotevn.config()

const hasuraSecret = process.env.HASURA_ADMIN_SECRET ? process.env.HASURA_ADMIN_SECRET : ''
const hasuraURL = process.env.SCHEMA_URL ? process.env.SCHEMA_URL : ''

const config: CodegenConfig = {
  overwrite: true,
  schema: [{
    [`${hasuraURL}`] : {
      headers: {
        'x-hasura-admin-secret' : hasuraSecret
      }
    }
  }],
  documents: "./**/*.gql",
  generates: {
    "./gql/schema.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
