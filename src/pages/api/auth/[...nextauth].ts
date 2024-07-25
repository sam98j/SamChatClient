import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 100000,
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup_with_google`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${account?.id_token}`,
          },
        });
        const resParsed = await res.json();
        console.log(res);

        token = Object.assign({}, token, {
          id_token: account.id_token,
        });
        token = Object.assign({}, token, {
          myToken: resParsed.access_token,
        });
        return token;
      }
      return token;
      // console.log("in jwt",token)
    },
    async session({ session, token, user }) {
      if (session) {
        session = Object.assign({}, session, {
          id_token: token.id_token,
        });
        session = Object.assign({}, session, {
          authToken: token.myToken,
        });
      }
      return session;
    },
    async signIn({ user }) {
      //   console.log(user);
      return true;
    },
  },
};

export default NextAuth(authOptions);
