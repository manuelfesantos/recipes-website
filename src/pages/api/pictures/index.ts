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
    Key: `${req.query.name}`,
  });
  console.log(req.query.name);
  const url = await getSignedUrl(r2Client, command, {
    expiresIn: 3600,
  });
  const headers = new Headers();

  console.log(req.file);

  const response = await fetch(url, {
    method: "PUT",
    body: req.file.buffer,
    headers: headers,
  });

  console.log(response.status);

  if (response.status === 200) {
    const fileNameArray = req.file.originalname.split(".");
    fileNameArray.pop();
    const fileName = fileNameArray.join("");

    res.json({
      status: 200,
      message: `${fileName} uploaded successfully`,
    });
  } else {
    res.json({ status: 500 });
  }
});

export default router.handler();

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
