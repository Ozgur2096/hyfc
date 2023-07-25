import useFetch from "./useFetch.js";

export const useGetAnswersByQuestionId = (setResponses, id) => {
  const { isLoading, error, cancelFetch, performFetch } = useFetch(
    `/message?chat_id=${id}`,
    (jsonResult) => {
      setResponses(jsonResult.result);
    }
  );
  error;
  const isLoadingGetAnswers = isLoading;
  const performGetAnswersByQuestionId = () => performFetch();
  const cancelGetAnswersByQuestionId = () => cancelFetch();

  return {
    isLoadingGetAnswers,
    performGetAnswersByQuestionId,
    cancelGetAnswersByQuestionId,
  };
};
