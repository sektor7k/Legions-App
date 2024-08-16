
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import mongoose from "mongoose";
import User from "@/models/User"; // User modelinizi doğru yoldan import edin
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {

      const self = await getServerSession({...authOptions});
      if (!self) {
        throw new UploadThingError("Unauthorized");
      }

      return { user: self };

    })
    .onUploadComplete(async ({ metadata, file }) => {
      // // MongoDB'ye bağlanma
      // if (!mongoose.connection.readyState) {
      //   await connectDB();
      // }

      // const res = await User.findOneAndUpdate(
      //   { email: metadata.user.user.email },
      //   { image: file.url },
      //   { new: true, runValidators: true }
      // );
      // console.log("res",res);

      console.log("FILE URL: ", file.url)


      return { fileUrl: file.url };

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
