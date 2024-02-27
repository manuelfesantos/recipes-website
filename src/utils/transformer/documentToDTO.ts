import { UserDTO } from "@/types/user";

export function buildUserDTOFromDocument(user: any): UserDTO {
  return {
    username: user.username,
    _id: `${user._id}`,
    recipes: user.recipes,
  };
}
