import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecovery } from "../../hooks/useRecovery";
import { useVerifyCode } from "../../hooks/useVerifyCode";
import NavSignUp from "../../components/NavBars/NavSignUp";
import "./Recovery.css";

function Recovery() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const {
    sendCode,
    isLoading: isLoadingSendCode,
    error: errorSendCode,
    cancelFetch: cancelFetchSendCode,
  } = useRecovery();

  const {
    checkVerificationCode,
    updatePassword,
    isLoading: isLoadingVerifyCode,
    error: errorVerifyCode,
    cancelFetch: cancelFetchVerifyCode,
    verificationResponse,
  } = useVerifyCode();

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      cancelFetchSendCode();
      cancelFetchVerifyCode();
    };
  }, []);

  useEffect(() => {
    if (verificationResponse && verificationResponse.success) {
      setIsCodeVerified(true);
    }
  }, [verificationResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendCode(email);
    setIsCodeSent(true);
  };

  const handleCodeChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    setCode(input);
    if (input.length === 6 && email !== "") {
      checkVerificationCode(email, input);
    }
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const submitUpdatePassword = async () => {
    if (newPassword === confirmPassword) {
      await updatePassword(email, code, newPassword);
      alert("Password has been updated successfully!");
      navigate("/welcome");
    } else {
      alert("Passwords do not match");
    }
  };

  let statusComponent = null;
  if (errorSendCode || errorVerifyCode) {
    statusComponent = (
      <div>
        Error while trying to send code:{" "}
        {errorSendCode?.toString() || errorVerifyCode?.toString()}
      </div>
    );
  } else if (isLoadingSendCode || isLoadingVerifyCode) {
    statusComponent = <div>Please, wait...</div>;
  }

  return (
    <div className="recovery">
      <NavSignUp />
      <div className="recovery_form">
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <h1 className="recovery-title">Recovery password</h1>
          {!isCodeSent ? (
            <>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <button type="submit">Send code</button>
              {statusComponent}
            </>
          ) : (
            <>
              <input
                type="text"
                maxLength="6"
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter your code"
              />
              {isCodeVerified && (
                <>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm your new password"
                  />
                  <button onClick={submitUpdatePassword}>
                    Update Password
                  </button>
                </>
              )}
            </>
          )}
          {statusComponent}
        </form>
      </div>
    </div>
  );
}

export default Recovery;
