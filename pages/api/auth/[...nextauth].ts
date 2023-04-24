// // pages/api/auth/[...nextauth].ts

// import { NextApiHandler } from 'next';
// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import GitHubProvider from 'next-auth/providers/github';
// import prisma from '../../../lib/prisma';

// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
// export default authHandler;

// const options = {
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//   ],
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.SECRET,
// };

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { isNullOrUndefined } from "util";
import dotenv from 'dotenv';

dotenv.config();
const USER = process.env.CRED_USERNAME;
const PASS = process.env.CRED_PASSWORD;

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        // username: {label: "Username", type:"text", placeholder: "username"},
        // password: {label: "Password", type: "password", placeholder: "*****"},
      },
      authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        // perform you login logic
        // find out user from db
        if (!isNullOrUndefined(USER) && !isNullOrUndefined(PASS)){
          if (username !== USER || password !== PASS) {
            throw new Error("invalid credentials: check env");
          }
        }
        // if (username !== 'test' || password !== '1234') {
        //   throw new Error("invalid credentials");
        // }

        // if everything is fine
        return {
          id: "1234",
          name: "Stray Leaves",
          username: "Stray Leaves",
          role: "admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  callbacks: {
    jwt(params) {
      // update token
      if (params.user?.role) {
        params.token.role = params.user.role;
      }
      // return final_token
      return params.token;
    },
  },
};

export default NextAuth(authOptions);