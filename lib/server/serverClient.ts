// doing a server client installation
// this client is only runing on server

// use apollo client too connect to our application
// this allow us to make request on our app

import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

export const serverClient = new ApolloClient({
  // since we're running on server
  ssrMode: true,
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    // this one doesn't say next_public cause only on server
    headers: {
      Authorization: `Apikey ${process.env.GRAPHQL_TOKEN}`,
    },
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions
});
