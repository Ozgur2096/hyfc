import React, { useState, useContext, useEffect } from "react";
import Navbar from "../../components/NavBars/NavMain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { QuestionsContext } from "../../context/QuestionsContext";
import { useGetAnswersByQuestionId } from "../../hooks/useGetAnswersByQuestionId";
import useCreateMessage from "../../hooks/useCreateMessage";
import "../QuestionsView/QuestionView.css";
import { UserDetailCard } from "../../components/UserDetailCard";

export const QuestionView = () => {
  const [responses, setResponses] = useState([]);
  const [myResponse, setMyResponse] = useState("");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userPhotoId, setUserPhotoId] = useState("");
  const { question } = useContext(QuestionsContext);
  const {
    isLoadingGetAnswers,
    performGetAnswersByQuestionId,
    cancelGetAnswersByQuestionId,
  } = useGetAnswersByQuestionId(setResponses, question._id);

  let loadingAnswers = null;
  if (isLoadingGetAnswers) {
    loadingAnswers = <div>Answers Loading ...</div>;
  }

  const { createMessage } = useCreateMessage();

  useEffect(() => {
    performGetAnswersByQuestionId();
    return cancelGetAnswersByQuestionId;
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (myResponse.trim().length === 0) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("auth"));
    const newResponse = {
      user_id: user.id,
      message_text: myResponse,
      chat_id: question._id,
    };

    setResponses([
      ...responses,
      {
        _id: new Date().toISOString(),
        message_text: myResponse,
        sent_datetime: new Date().toISOString(),
      },
    ]);

    try {
      createMessage(user, newResponse);
    } catch (error) {
      alert("Error creating message:", error);
    }

    setMyResponse("");
  };

  const handlePhotoClick = (e) => {
    const userId = e.currentTarget.dataset.userid;
    setUserPhotoId(userId);
    setShowUserDetails(!showUserDetails);
  };

  const handleAvatarClick = (e) => {
    const userId = e.currentTarget.dataset.userid;
    setUserPhotoId(userId);
    setShowUserDetails(!showUserDetails);
  };

  return (
    <>
      {showUserDetails && (
        <UserDetailCard
          userId={userPhotoId}
          setShowUserDetails={setShowUserDetails}
        />
      )}
      <Navbar />
      <div className="questions-container-view">
        <div
          className="avatar-container"
          data-userid={question.creator_user}
          onClick={handleAvatarClick}
        >
          {question.userImage ? (
            <img
              className="profile-photo-container"
              src={question.userImage}
              data-userid={question.creator_user}
              onClick={handlePhotoClick}
              alt="User Avatar"
            />
          ) : (
            <FontAwesomeIcon
              className="profile-photo-container"
              icon={faUser}
            />
          )}
        </div>
        <div className="q-w-question">
          <div className="question-title-text">
            <h2 className="question-title">{question.chat_title}</h2>
            <p className="question-text">{question.chat_text}</p>
          </div>
          <div className="question-detail">
            <div className="date-time">
              <div className="date">{question.creation_time.split("T")[0]}</div>
              <div className="time">
                {question.creation_time.split("T")[1].split(".")[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="question-detail-page-container">
        <div className="question-detail-container">
          <div className="reply-question">
            <textarea
              className="reply-question-input"
              placeholder="Your response"
              name="reply-question"
              value={myResponse}
              onChange={(event) => setMyResponse(event.target.value)}
            />
            <button className="reply-question-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div>
            {loadingAnswers}
            {responses
              .slice()
              .reverse()
              .map((response) => (
                <div key={response._id} className="response">
                  <div
                    className="avatar-container"
                    data-userid={response.user_id}
                    onClick={handleAvatarClick}
                  >
                    {response.userImage ? (
                      <img
                        className="profile-photo-container profile-photo-container-response"
                        src={response.userImage}
                        data-userid={response.user_id}
                        onClick={handlePhotoClick}
                        alt="User Avatar"
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="profile-photo-container profile-photo-container-response"
                        icon={faUser}
                      />
                    )}
                  </div>
                  <div className="response-content">
                    <div className="response-answer">
                      {response.message_text}
                    </div>
                    <div className="date-time">
                      <div className="date">
                        {response.sent_datetime.split("T")[0]}
                      </div>
                      <div className="time">
                        {response.sent_datetime.split("T")[1].split(".")[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
