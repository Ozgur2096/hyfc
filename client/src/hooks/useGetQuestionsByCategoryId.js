import useFetch from "./useFetch.js";

export const useGetQuestionsByCategoryId = (setQuestions, categoryId) => {
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/chat?category_id=${categoryId}&is_public=true`,
    (jsonResult) => {
      setQuestions(jsonResult.result);
    }
  );
  error;
  const performGetQuestionsByCategoryId = () => performFetch();
  const cancelGetQuestionsByCategoryId = () => cancelFetch();

  return {
    isLoading,
    performGetQuestionsByCategoryId,
    cancelGetQuestionsByCategoryId,
  };
};
