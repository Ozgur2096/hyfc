import React from "react";

const PasswordInfo = () => {
  return (
    <div className="password-info">
      <p>The password must be at least 8 characters long.</p>
      <p>
        The password must be strong, it should contain a combination of
        uppercase letters, lowercase letters, numbers, and special characters.
      </p>
    </div>
  );
};

export default PasswordInfo;
