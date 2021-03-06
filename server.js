const { ApolloServer } = require("apollo-server");
const { resolvers } = require("./graphql/resolvers");
const { typeDefs } = require("./graphql/typeDefs");
const { generateUploadUrl } = require("./aws/S3");

async function hi() {
  await generateUploadUrl();
}
hi();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  cors: {
    origin: "*",
    credentials: true,
  },
});

const PORT = process.env.PORT || 3999;
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server running at ${url}`);
});
