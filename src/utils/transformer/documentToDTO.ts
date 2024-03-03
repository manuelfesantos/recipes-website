import { UserDTO } from "@/types/user";

export const buildUserDTOFromDocument = (user: any): UserDTO => ({
  _id: `${user._id}`,
  email: user.email,
  firstName: user.firstName,
  imageUrl: user.imageUrl,
  lastName: user.lastName,
  recipes: user.recipes,
  username: user.username,
});
