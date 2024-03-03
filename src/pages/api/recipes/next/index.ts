import { NextApiRequest, NextApiResponse } from "next";
import { getRecipesByHref } from "@/utils/edamam-api/api-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.json({ message: "Method not allowed", status: 405 });
    return;
  }
  try {
    const href = req.headers.href;
    const recipes = await getRecipesByHref(`${href}`);
    res.json({ recipes, status: 200 });
  } catch (err) {
    res.json({ err, status: 500 });
  }
}
