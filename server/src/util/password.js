import bcrypt from "bcrypt";

// generating hashed password by bcrypt
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// compere plain text Password and encrypted password from Mongo
export async function comparePassword(plaintextPassword, hash) {
  const validPassword = await bcrypt.compare(plaintextPassword, hash);
  return validPassword;
}
