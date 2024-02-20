import { Recipe } from "@/types/recipes";

export interface User {
  _id: string;
  username: string;
  password: string;
}

export interface UserList {
  [key: number]: User;
}
