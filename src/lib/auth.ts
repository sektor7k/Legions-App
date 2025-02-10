import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";

interface ExtendedUser extends NextAuthUser {
  id: string;
  username: string;
  isVerifed: boolean;
  isAdmin: boolean;
  image: string;
  socialMedia: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  wallets: {
    evm?: string;
    solana?: string;
  };
  role:string;
  status: string;
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

        if (!userFound.isVerifed) {
          throw new Error("Please verify your email address.");
        }

        // Burada tüm gerekli alanların olduğundan emin olun
        return {
          id: userFound._id,
          email: userFound.email,
          username: userFound.username,
          isVerifed: userFound.isVerifed,
          role: userFound.role,
          image: userFound.image,
          socialMedia: userFound.socialMedia,
          wallets: userFound.wallets,
          status: userFound.status,
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
    async signIn({ user, account }) {
      try {
        // Eğer provider google ise
        if (account?.provider === "google") {
          if (!user.email) {
            throw new Error("Unable to receive email from Google account.");
          }

          await connectDB();
          const userExists = await User.findOne({ email: user.email });
          if (!userExists) {

            await User.create({
              email: user.email,
              username: user.email.split("@")[0],
              image: user.image,
              isVerifed: true, 
              role: "user", 
              socialMedia: {},
              wallets: {},
              status: "active",
              provider: "google"
            });
          }
        }
        return true; // Girişe izin ver
      } catch (error) {
        console.error("SignIn Callback Error:", error);
        return false; // Giriş reddedilebilir
      }
    },
    async jwt({ token, user,trigger, session }) {
      if (user) {
        await connectDB();
        // DB'de email'e göre kullanıcıyı arıyoruz.
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          // DB'deki kullanıcı kaydından gelen değerleri token'a aktarıyoruz.
          token.id = dbUser._id.toString();
          token.username = dbUser.username;  // DB'de oluşturduğunuz username
          token.email = dbUser.email;
          token.image = dbUser.image;
          token.socialMedia = dbUser.socialMedia;
          token.wallets = dbUser.wallets;
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }else if (token.id) {
        // Diğer isteklerde DB'den güncel kullanıcı durumunu alalım.
        try {
          await connectDB();
          const currentUser = await User.findById(token.id);
          if (currentUser) {
            token.username = currentUser.username;
            token.status = currentUser.status;
          }
        } catch (error) {
          console.error("Error updating token status:", error);
        }
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
        isAdmin: token.isAdmin,
        status: token.status,
      };
      return session;
    },
  },
};
