import { NextApiRequest, NextApiResponse } from "next";
import { getRecipesBySearchWord } from "@/utils/edamam-api/api-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.json({ message: "Method not allowed", status: 405 });
    return;
  }

  const searchWord = `${req.query.searchword}`;

  try {
    const recipes = await getRecipesBySearchWord(searchWord);
    res.json({ recipes, status: 200 });
  } catch (err) {
    res.json({ err, status: 500 });
  }
}
