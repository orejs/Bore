import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from 'lib/mongodb';

import { descriptor, AuthorizeByPass } from 'collections';
import { serializable } from 'utils';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'Type', type: 'text' },
      },
      async authorize(credentials, req) {
        if (credentials) {
          const { username, password, type } = credentials;
          if (type !== 'account') return null;
          const doc = await descriptor(AuthorizeByPass)(username, password);
          if (doc === null) {
            return Promise.reject('用户名或密码错误');
          }
          return { ...serializable(doc), id: String(doc._id) };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/user/login',
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn', user, account, profile, email, credentials);

      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('redirect', url, baseUrl);
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log('session', session, user, token);
      if (session?.user) {
        if (user?.access) session.user.access = user.access;
        if (user?.id) session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('jwt', token, user, account, profile, isNewUser);
      return token;
    },
  },
};

export default NextAuth(authOptions);
