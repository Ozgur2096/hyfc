import useFetch from "./useFetch";

export const useRecovery = () => {
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/auth/recovery",
    () => {}
  );

  const sendCode = (email) => {
    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
  };

  return { sendCode, isLoading, error, cancelFetch };
};
