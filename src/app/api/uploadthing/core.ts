import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import mongoose from "mongoose";
import User from "@/models/User"; // User modelinizi doğru yoldan import edin
import { connectDB } from "@/lib/mongodb";
import { getSelf } from "@/lib/auth-service";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";

const f = createUploadthing();



export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {

      const self = await getSession();
      console.log("SELF:",self);
      if (!self) {
        throw new UploadThingError("Unauthorized");
      }

      return { user: self };

    })
    .onUploadComplete(async ({ metadata, file }) => {

      // MongoDB'ye bağlanma
      if (!mongoose.connection.readyState) {
        await connectDB();
      }



      await User.findByIdAndUpdate(
        metadata.user?.user.id,
        { image: file.url },
        { new: true, runValidators: true }
      );

      return { fileUrl: file.url };

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
