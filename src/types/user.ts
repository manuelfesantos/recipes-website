import { Recipe } from "@/types/recipes";

export interface User {
  _id?: string;
  email: string;
  firstName: string;
  imageUrl?: string;
  lastName: string;
  password: string;
  recipes: Recipe[];
  username: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserDTO {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  username: string;
  recipes: Recipe[];
}

export interface UserList {
  [key: number]: User;
}
