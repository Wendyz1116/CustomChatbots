"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../graphql/apolloClient";

// this wrapper is a client component
// warp around the main app layout
const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper