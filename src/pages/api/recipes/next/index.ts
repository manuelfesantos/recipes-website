import { NextApiRequest, NextApiResponse } from "next";
import { getRecipesByHref } from "@/utils/edamam-api/api-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.json({ status: 405, message: "Method not allowed" });
    return;
  }
  try {
    const href = req.headers.href;
    const recipes = await getRecipesByHref(`${href}`);
    res.json({ status: 200, recipes });
  } catch (err) {
    res.json({ status: 500, err });
  }
}
