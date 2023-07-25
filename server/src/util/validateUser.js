import validateAllowedFields from "./validateAllowedFields.js";

// validateUser
const validateUser = (userObject) => {
  const errorList = [];
  const allowedKeys = [
    "firstName",
    "lastName",
    "hyfClass",
    "role",
    "email",
    "password",
  ];

  const validatedKeysMessage = validateAllowedFields(userObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }
  const { firstName, lastName, hyfClass, role, email, password } = userObject;
  if (
    firstName == null ||
    lastName == null ||
    hyfClass == null ||
    role == null ||
    email == null ||
    password == null
  ) {
    errorList.push("All fields are required, please fill in all fields");
  }

  return errorList;
};

export default validateUser;
