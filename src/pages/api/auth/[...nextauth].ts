import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 40000,
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'online',
          response_type: 'code',
        },
      },
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        // api url
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup_with_google`;
        // fetch api url
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${account?.id_token}`,
          },
        });
        const resParsed = await res.json();
        console.log(resParsed);
        token = Object.assign({}, token, {
          id_token: account.id_token,
        });
        token = Object.assign({}, token, {
          loggedInUser: resParsed.loggedInUser,
          myToken: resParsed.access_token,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          id_token: token.id_token,
        });
        session = Object.assign({}, session, {
          loggedInUser: token.loggedInUser,
          authToken: token.myToken,
        });
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
