import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hyfClass: { type: String },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 7 },
  recovery_code: { type: String, required: false },
  image: { type: String },
  country: { type: String },
  date_of_birth: { type: Date },
  telephone_number: { type: Number },
  about_me: { type: String },
});

// static signup method
userSchema.statics.signup = async function (userObject) {
  const { firstName, lastName, hyfClass, role, email, password } = userObject;
  // validation
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("User already exists");
  }
  if (!validator.isLength(password, { min: 8 })) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    hyfClass,
    role,
    email,
    password: hashedPassword,
  });
  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  // validation
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User does not exist");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model("users", userSchema);

export default User;
