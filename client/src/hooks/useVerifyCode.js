import { useState } from "react";
import useFetch from "./useFetch";

export const useVerifyCode = () => {
  const [verificationResponse, setVerificationResponse] = useState(null);

  const handleReceived = (response) => {
    setVerificationResponse(response);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/auth/verify-code",
    handleReceived
  );

  const checkVerificationCode = async (email, code) => {
    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });
  };

  const updatePassword = async (email, code, password) => {
    performFetch({
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        password,
      }),
    });
  };

  return {
    checkVerificationCode,
    updatePassword,
    isLoading,
    error,
    cancelFetch,
    verificationResponse,
  };
};
