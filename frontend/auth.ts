import NextAuth from "next-auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [{
    id: "tunnistamo", // signIn("my-provider") and will be part of the callback URL
    name: "Tunnistamo", // optional, used on the default login page as the button text.
    type: "oidc", // or "oauth" for OAuth 2 providers
    issuer: process.env.AUTH_CLIENT_ISSUER || "https://testitunnistamo.turku.fi/openid",
    clientId: process.env.AUTH_CLIENT_ID, // from the provider's dashboard
    clientSecret: process.env.AUTH_CLIENT_SECRET, // from the provider's dashboard
  }],
})