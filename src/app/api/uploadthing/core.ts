
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {

      const self = await getServerSession({...authOptions});
      if (!self) {
        throw new UploadThingError("Unauthorized");
      }

      return { user: self };

    })
    .onUploadComplete(async ({ metadata, file }) => {

      console.log("FILE URL: ", file.url)


      return { fileUrl: file.url };

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
