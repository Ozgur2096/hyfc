import createTestIdFilePath from "../../util/createTestIdFilePath";

const TEST_ID = {
  container: `${createTestIdFilePath("pages", "User", "CreateUser")}-container`,
  firstNameInput: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-firstNameInput`,
  lastNameInput: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-lastNameInput`,
  hyfClassInput: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-hyfClassInput`,
  roleInput: `${createTestIdFilePath("pages", "User", "CreateUser")}-roleInput`,
  emailInput: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-emailInput`,
  passwordInput: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-passwordInput`,
  submitButton: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-submitButton`,
  loadingContainer: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-loadingContainer`,
  errorContainer: `${createTestIdFilePath(
    "pages",
    "User",
    "CreateUser"
  )}-errorContainer`,
};

export default TEST_ID;
