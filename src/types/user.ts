import { Recipe } from "@/types/recipes";

export interface User {
  _id?: string;
  username: string;
  password: string;
  recipes: Recipe[];
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserDTO {
  _id: string;
  username: string;
  recipes: Recipe[];
}

export interface UserList {
  [key: number]: User;
}
