import { useAuthContext } from "./useAuthContext";
import { useUserContext } from "./useUserContext";

export const useLogout = () => {
  const { dispatch: userDispatch } = useUserContext();
  const { dispatch: authDispatch } = useAuthContext();

  const logout = async () => {
    // delete the user info from local storage
    localStorage.removeItem("auth");
    // update the user context
    userDispatch({ type: "REMOVE_USER" });
    // update the auth context
    authDispatch({ type: "LOGOUT" });
  };

  return { logout };
};
