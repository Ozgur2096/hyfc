import { useAuthContext } from "./useAuthContext";
import { useUserContext } from "./useUserContext";
import useFetch from "./useFetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { dispatch: userDispatch } = useUserContext();
  const { dispatch: authDispatch, auth } = useAuthContext();
  const navigate = useNavigate();

  // USER FETCH: Get user info
  const {
    error: userError,
    performFetch: performUserFetch,
    cancelFetch: cancelUserFetch,
  } = useFetch(`/user/${auth?.id}`, (jsonResult) => {
    // Updating UserContext with fetched user info
    userDispatch({ type: "SET_USER", payload: jsonResult.result });
    navigate("/questions");
  });

  // AUTH FETCH: Login with credentials
  const {
    isLoading,
    error: authError,
    performFetch: performAuthFetch,
    cancelFetch: cancelAuthFetch,
  } = useFetch("/auth/login", (jsonResult) => {
    localStorage.setItem("auth", JSON.stringify(jsonResult));
    // Updating AuthContext
    authDispatch({ type: "LOGIN", payload: jsonResult });
  });

  useEffect(() => {
    // Get user from database only when there is auth
    if (auth) {
      performUserFetch();
    }
    return cancelUserFetch;
  }, [auth]);

  useEffect(() => {
    return cancelAuthFetch;
  }, []);

  const login = async (email, password) => {
    performAuthFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  };

  return { login, isLoading, userError, authError };
};
