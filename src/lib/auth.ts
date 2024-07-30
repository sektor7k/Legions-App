import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

interface ExtendedUser extends NextAuthUser {
  id: string;
  username: string;
  isVerified: boolean;
  isAdmin: boolean;
  image: string;
  socialMedia: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  wallets: {
    evm?: string;
    btc?: string;
    solana?: string;
    sei?: string;
    aptos?: string;
    sui?: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!userFound) throw new Error("Invalid Email");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Invalid Password");

        

        // Burada tüm gerekli alanların olduğundan emin olun
        return {
          id: userFound._id,
          email: userFound.email,
          username: userFound.username,
          isVerified: userFound.isVerified,
          isAdmin: userFound.isAdmin,
          image: userFound.image,
          socialMedia: userFound.socialMedia,
          wallets: userFound.wallets,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user,trigger, session }) {
      if (user) {
        const u = user as ExtendedUser;
        token.id = u.id;
        token.username = u.username;
        token.email = u.email;
        token.image= u.image;
        token.socialMedia = u.socialMedia;
        token.wallets = u.wallets;
      }

      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.image) token.image = session.image;
        if (session.socialMedia) token.socialMedia = session.socialMedia;
        if (session.wallets) token.wallets = session.wallets;
      }
      

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        email: token.email,
        image: token.image,
        socialMedia: token.socialMedia,
        wallets: token.wallets,
      };
      return session;
    },
  },
};
