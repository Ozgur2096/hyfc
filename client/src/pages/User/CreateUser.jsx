import React, { useEffect, useState } from "react";
import Select from "react-select";
import Input from "../../components/Input";
import TEST_ID from "./CreateUser.testid";
import NavSignUp from "../../components/NavBars/NavSignUp";
import "./CreateUser.css";
import { useSignUp } from "../../hooks/useSignUp";
import PasswordInfo from "../../components/PasswordInfo";
import { Link } from "react-router-dom";

const CreateUser = () => {
  const [info, setInfo] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    hyfClass: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    firstName,
    lastName,
    hyfClass,
    role,
    email,
    password,
    confirmPassword,
  } = user;

  const onSuccess = () => {
    setUser({
      firstName: "",
      lastName: "",
      hyfClass: "",
      role: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  const { signUp, isLoading, error, cancelFetch } = useSignUp(onSuccess);

  useEffect(() => {
    return cancelFetch;
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password and confirm password fields do not match");
      return;
    }
    await signUp(user);
  }

  let statusComponent = null;
  if (password !== confirmPassword) {
    statusComponent = (
      <div data-testid={TEST_ID.errorContainer}>
        Please check your password and confirm password
      </div>
    );
  } else if (error != null) {
    statusComponent = (
      <div data-testid={TEST_ID.errorContainer}>{error.toString()}</div>
    );
  } else if (isLoading) {
    statusComponent = (
      <div data-testid={TEST_ID.loadingContainer}>Creating user....</div>
    );
  }

  const handleInfoClick = () => {
    setInfo(!info);
  };

  return (
    <>
      <NavSignUp />
      <div className="create-user" data-testid={TEST_ID.container}>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <h1 className="sign-up-header">Sign Up</h1>{" "}
            <Input
              className="input-signup"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={(value) => setUser({ ...user, firstName: value })}
              data-testid={TEST_ID.firstNameInput}
            />
          </div>

          <div className="form-group">
            {" "}
            <Input
              className="input-signup"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={(value) => setUser({ ...user, lastName: value })}
              data-testid={TEST_ID.lastNameInput}
            />
          </div>

          <div className="form-group">
            {" "}
            <Select
              className="role-select"
              placeholder="Role"
              name="role"
              value={role}
              options={[
                { value: "mentor", label: "Mentor" },
                { value: "student", label: "Student" },
              ]}
              onChange={(selectedOption) => {
                setUser({ ...user, role: selectedOption });
              }}
              data-testid={TEST_ID.roleInput}
            />
          </div>

          {user.role.value === "student" ? (
            <div className="form-group">
              {" "}
              <Input
                className="input-signup"
                type="number"
                placeholder="HYF Class"
                name="hyfClass"
                value={hyfClass}
                onChange={(value) => setUser({ ...user, hyfClass: value })}
                data-testid={TEST_ID.hyfClassInput}
              />
            </div>
          ) : null}

          <div className="form-group">
            {" "}
            <Input
              className="input-signup"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(value) => setUser({ ...user, email: value })}
              data-testid={TEST_ID.emailInput}
            />
          </div>

          <div className="form-group form-group-password">
            {" "}
            <Input
              className="input-signup"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(value) => setUser({ ...user, password: value })}
              data-testid={TEST_ID.passwordInput}
            />
            <button
              className="info-button"
              type="button"
              onClick={handleInfoClick}
            >
              i
            </button>
          </div>

          {info && <PasswordInfo />}

          <div className="form-group">
            {" "}
            <Input
              className="input-signup"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(value) => setUser({ ...user, confirmPassword: value })}
            />
          </div>
          <div className="button-group">
            <button
              className="sign-up-btn"
              type="submit"
              data-testid={TEST_ID.submitButton}
            >
              Sign up
            </button>
            <Link className="log-in-link" to="/">
              Log in
            </Link>
          </div>
        </form>
        {statusComponent}
      </div>
    </>
  );
};

export default CreateUser;
