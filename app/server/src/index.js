const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

const LaunchAPI = require('./datasources/launch');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    launchAPI: new LaunchAPI()
  }),
  resolvers
});

server.listen().then( ({url}) => {
  console.log(`🚀 Apollo Server ready at ${url}`);
});

