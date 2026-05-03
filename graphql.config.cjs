require("dotenv/config");

/** @type {import('graphql-config').IGraphQLConfig} */
module.exports = {
  schema: "src/graphql/schema.json",
  documents: ["src/graphql/**/*.graphql"],
};
