import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const QuestionsContext = createContext();

export const QuestionsContextProvider = ({ children }) => {
  const [question, setQuestion] = useState(null);

  const setQuestionData = (questionData) => {
    setQuestion(questionData);
  };

  return (
    <QuestionsContext.Provider value={{ question, setQuestionData }}>
      {children}
    </QuestionsContext.Provider>
  );
};

QuestionsContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
