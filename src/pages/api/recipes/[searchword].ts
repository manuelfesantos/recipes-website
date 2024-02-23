import { NextApiRequest, NextApiResponse } from "next";
import { getRecipesBySearchWord } from "@/utils/edamam-api/api-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.json({ status: 405, message: "Method not allowed" });
    return;
  }

  const searchWord = `${req.query.searchword}`;

  try {
    const recipes = await getRecipesBySearchWord(searchWord);
    res.json({ status: 200, recipes });
  } catch (err) {
    res.json({ status: 500, err });
  }
}
