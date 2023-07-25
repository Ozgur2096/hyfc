import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const useCreateMessage = () => {
  const { performFetch, error } = useFetch("/message/create");
  const [sendMessageError, setSendMessageError] = useState(null);

  useEffect(() => {
    if (error) {
      setSendMessageError(error);
    }
  }, [error]);

  const createMessage = async (user, messageData) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(messageData),
      };

      await performFetch(options);
    } catch (error) {
      setSendMessageError(error);
    }
  };

  return {
    createMessage,
    error: sendMessageError,
  };
};

export default useCreateMessage;
