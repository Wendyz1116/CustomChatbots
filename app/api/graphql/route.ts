// THis is to make the actually backend link
// const httpLink = createHttpLink({
//   uri: `${BASE_URL}/api/graphql` // point to the new API route
// })
// From apolloClient

// this is responsible for the proxy end
import { NextRequest, NextResponse } from "next/server";
import { gql } from "@apollo/client";
import { serverClient } from "../../../lib/server/serverClient";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// this only accept the post function
// it's dynamic but all post r be default
export async function POST(request: NextRequest) {
  // pass in query and variables form front end
  const { query, variables } = await request.json();

  // usually inside graph ql can usually expect 2 things
  // 1. a query coming in , gimme this data
  // 2. or a mutation, insert a message into datebase
  // so need to check these two
  try {
    let result;
    if (query.trim().startsWith("mutation")) {
      // Handle mutations
      // TO do this we need a client, not a clientside
      // the one we just made with apolloClient
      // thing but a server-client
      // this one is only running on the server
      result = await serverClient.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
      });
    } else {
      // Handle queries
      // call the server client to get the data
      // the server Client is the one that is auth to get info
      result = await serverClient.query({
        query: gql`
          ${query}
        `,
        variables,
      });
    }
    const data = result.data;
    return NextResponse.json(
      {
        data,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
