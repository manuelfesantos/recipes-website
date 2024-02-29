import { UserDTO } from "@/types/user";

export function buildUserDTOFromDocument(user: any): UserDTO {
  return {
    _id: `${user._id}`,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    recipes: user.recipes,
    username: user.username,
    imageUrl: user.imageUrl,
  };
}
