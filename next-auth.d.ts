// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string
    token?: string;
    user: {
      id: any;
      username: any;
      email: any;
      image: any;
      socialMedia: any;
      wallets: any;
      isAdmin: any;
      status: any;
      // diğer özel alanlarınız
    };
  }
}
