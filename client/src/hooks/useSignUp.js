import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useUserContext } from "./useUserContext";
import useFetch from "./useFetch";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const { dispatch: userDispatch } = useUserContext();
  const { dispatch: authDispatch, auth } = useAuthContext();
  const navigate = useNavigate(); // Instantiate useNavigate

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/auth/signup",
    (jsonResult) => {
      // save the user info to local storage
      localStorage.setItem("auth", JSON.stringify(jsonResult));
      // update the auth context
      authDispatch({ type: "LOGIN", payload: jsonResult });
    }
  );

  // USER FETCH: Get user info
  const { performFetch: performUserFetch, cancelFetch: cancelUserFetch } =
    useFetch(`/user/${auth?.id}`, (jsonResult) => {
      // Updating UserContext with fetched user info
      userDispatch({ type: "SET_USER", payload: jsonResult.result });
      // redirect to the dashboard using useNavigate
      navigate("/questions");
    });

  useEffect(() => {
    // Get user from database only when there is auth
    if (auth) {
      performUserFetch();
    }
    return cancelUserFetch;
  }, [auth]);

  useEffect(() => {
    return cancelFetch;
  }, []);

  const signUp = async (user) => {
    const { firstName, lastName, hyfClass, role, email, password } = user;

    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user: {
          firstName,
          lastName,
          hyfClass,
          role: role.value,
          email,
          password,
        },
      }),
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return { signUp, isLoading, error, cancelFetch };
};
