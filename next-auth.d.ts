// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?:string
    token?: string;
    user: {
      id: string;
      username: string;
      email: string;
      image: string;
      // diğer özel alanlarınız
    };
  }
}
