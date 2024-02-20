import { Recipe } from "@/types/recipes";

export interface User {
  username: string;
  password: string;
  favorites: Recipe[];
}
