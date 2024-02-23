import { PageConfig } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as process from "process";
import { r2Client } from "@/utils/cloudflare-r2/r2-client";
import { createApiFileRouter } from "@/utils/next-connect/api-file-router";

const router = createApiFileRouter("picture");
router.put(async (req, res) => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: req.file.originalname,
  });
  const url = await getSignedUrl(r2Client, command, {
    expiresIn: 3600,
  });
  const headers = new Headers();

  const response = await fetch(url, {
    method: "PUT",
    body: req.file.buffer,
    headers: headers,
  });
  res.json(response.status);

  res.status(200).json({ message: "Image uploaded successfully" });
});

export default router.handler();

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
