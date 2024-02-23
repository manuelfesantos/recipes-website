import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

const multer = require("multer");

const upload = multer();

interface MulterRequest extends NextApiRequest {
  file: {
    originalname: string;
    buffer: Buffer;
  };
}

export const createApiFileRouter = (filePath: string) =>
  createRouter<MulterRequest, NextApiResponse>().use(upload.single(filePath));
