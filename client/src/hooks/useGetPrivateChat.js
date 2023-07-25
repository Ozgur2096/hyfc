import useFetch from "./useFetch";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useGetPrivateChat = (setChatId) => {
  const { auth } = useContext(AuthContext);
  const {
    error,
    performFetch,
    cancelFetch: cancelPrivateChatFetch,
  } = useFetch("/chat", (res) => handleReceived(res));

  const token = auth.token;

  const getPrivateChat = async (userId1, userId2) => {
    const requestBody = {
      userId1,
      userId2,
    };
    try {
      performFetch({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReceived = (response) => {
    if (response.success === true) {
      const { id } = response;
      setChatId(id);
    } else {
      setChatId(null);
    }
  };

  return { error, getPrivateChat, cancelPrivateChatFetch };
};

export default useGetPrivateChat;
