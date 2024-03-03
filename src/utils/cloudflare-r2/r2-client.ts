import { S3Client } from "@aws-sdk/client-s3";
import process from "process";

export const r2Client = new S3Client({
  credentials: {
    accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
  },
  endpoint: `${process.env.R2_ENDPOINT}`,
  region: "auto",
});
