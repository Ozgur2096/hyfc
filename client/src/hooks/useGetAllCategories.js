import useFetch from "./useFetch.js";

export const useGetAllCategories = (setCategories) => {
  const { error, performFetch, cancelFetch } = useFetch(
    "/categories",
    (jsonResult) => {
      setCategories(jsonResult.result);
    }
  );
  const errorGetAllCategories = error;
  const performGetAllCategories = () => performFetch();
  const cancelGetAllCategories = () => cancelFetch();

  return {
    performGetAllCategories,
    errorGetAllCategories,
    cancelGetAllCategories,
  };
};
