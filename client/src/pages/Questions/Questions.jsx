import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavBars/NavMain";
import { useGetQuestionsByCategoryId } from "../../hooks/useGetQuestionsByCategoryId";
import { useGetAllCategories } from "../../hooks/useGetAllCategories";
import "./Questions.css";
import { Link } from "react-router-dom";
import { QuestionsContext } from "../../context/QuestionsContext";
import { UserDetailCard } from "../../components/UserDetailCard";

export const Questions = () => {
  const [category, setCategory] = useState({
    category_name: "All",
    _id: "64905349466874bd960c2aca",
  });
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userPhotoId, setUserPhotoId] = useState("");
  const { setQuestionData } = useContext(QuestionsContext);

  const { performGetAllCategories, cancelGetAllCategories } =
    useGetAllCategories(setCategories);

  const {
    isLoading,
    performGetQuestionsByCategoryId,
    cancelGetQuestionsByCategoryId,
  } = useGetQuestionsByCategoryId(setQuestions, category._id);

  useEffect(() => {
    performGetQuestionsByCategoryId();
    performGetAllCategories();
    return () => {
      cancelGetAllCategories();
      cancelGetQuestionsByCategoryId();
    };
  }, []);

  useEffect(() => {
    performGetQuestionsByCategoryId();
  }, [category]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    setCategory(selectedCategory);
  };

  const handleQuestionClick = (question) => {
    setQuestionData(question);
  };

  const handlePhotoClick = (e) => {
    const userId = e.currentTarget.dataset.userid;
    setUserPhotoId(userId);
    setShowUserDetails(!showUserDetails);
  };

  return (
    <div>
      {showUserDetails && (
        <UserDetailCard
          userId={userPhotoId}
          setShowUserDetails={setShowUserDetails}
        />
      )}
      <Navbar />
      <div className="question-page-container">
        <select className="select-menu" onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category_name}
            </option>
          ))}
        </select>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="questions-container">
            {questions
              .slice()
              .reverse()
              .map((question) => (
                <div key={question._id} className="question-container">
                  <div
                    className="avatar-container"
                    data-userid={question.creator_user}
                    onClick={handlePhotoClick}
                  >
                    {question.userImage ? (
                      <img
                        className="profile-photo-container"
                        data-userid={question.creator_user}
                        src={question.userImage}
                        alt="User Avatar"
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="avatar-container"
                        data-userid={question.creator_user}
                        icon={faUser}
                      />
                    )}
                  </div>
                  <Link
                    to={`/questions/${question._id}`}
                    className="question"
                    onClick={() => {
                      handleQuestionClick(question);
                    }}
                  >
                    <div className="question-title-text">
                      <h2 className="question-title">{question.chat_title}</h2>
                      <p className="question-text">
                        {question.chat_text.slice(0, 100)}
                      </p>
                    </div>
                    <div className="question-detail">
                      <div className="answers">
                        Responded by{" "}
                        <span className="number-of-answers">
                          {question.numberOfAnswers}
                        </span>{" "}
                        user(s)
                      </div>
                      <div className="date-time">
                        <div className="date">
                          {question.creation_time.split("T")[0]}
                        </div>
                        <div className="time">
                          {question.creation_time.split("T")[1].split(".")[0]}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
