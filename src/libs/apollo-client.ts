import { InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink } from "@apollo/client";

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://champino.org/api/graphql";

// Log for debugging
if (typeof window !== "undefined") {
  console.log("[Apollo Client] Server URL:", serverUrl);
}

const httpLink = createHttpLink({
  uri: serverUrl,
  credentials: "include",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
