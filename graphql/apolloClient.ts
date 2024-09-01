import {
  ApolloClient,
  DefaultOptions,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

// make a base url
// in in production want to push to a vercel url
// otherwise in dev wanna go to local host

export const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

// how to connect the graph ql
// this is the not actual graph ql url
// but if we use that we risk exposing the secret api key
// instead we will create a proxy endpoint
// so the server can make authenticated request on the client's Apollo client's behalf
// so we just serve a an instruction, to the server apollo client that wil have
// the authentication polwer to ask for info from actual route
const httpLink = createHttpLink({
  uri: `${BASE_URL}/api/graphql` // point to the new API route
})
// make request to api/graphql backent

// opt out of caching
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

const client = new ApolloClient({
  link: httpLink,
  // to stop the caching issues
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

// set up apollo client
// this is diff than the client we are using
// for the server
export default client