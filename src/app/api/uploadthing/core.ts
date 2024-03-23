import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  userImageUploader: f({ image: { maxFileSize: '2MB' } }).onUploadComplete(
    async ({ file }) => file.url
  ),
  orgImageUploader: f({ image: { maxFileSize: '2MB' } }).onUploadComplete(
    async ({ file }) => file.url
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
