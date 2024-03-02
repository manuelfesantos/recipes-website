import process from "process";

const bcrypt = require("bcrypt");

export const encryptPassword = (password: string) =>
  bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));

export const comparePasswords = (
  enteredPassword: string,
  savedPassword: string,
) => bcrypt.compareSync(enteredPassword, savedPassword);
