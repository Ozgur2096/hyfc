import React, { useState, useEffect, useContext } from "react";
import NavMain from "../../components/NavBars/NavMain";
import { useGetAllCategories } from "../../hooks/useGetAllCategories";
import useFetch from "../../hooks/useFetch";
import "./AskQuestion.css";
import { UserContext } from "../../context/UserContext";

export default function AskQuestion() {
  const [titleValue, setTitleValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({});

  const { user } = useContext(UserContext);

  const { performGetAllCategories, cancelGetAllCategories } =
    useGetAllCategories(setCategories);
  const { isLoading, error, performFetch } = useFetch("/chat/create", () => {
    setTitleValue("");
    setTextValue("");
    setCheckboxValues({});
  });

  useEffect(() => {
    performGetAllCategories();
    return cancelGetAllCategories;
  }, []);

  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxValues((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("auth")).token;
    if (
      !titleValue ||
      !textValue ||
      !Object.values(checkboxValues).some((value) => value)
    ) {
      alert("Please fill in all fields and select at least one checkbox.");
      return;
    }

    const formData = {
      is_public: true,
      category_ids: Object.entries(checkboxValues)
        // eslint-disable-next-line no-unused-vars
        .filter(([key, value]) => value)
        .map(([key]) => {
          const matchingCategory = categories.find(
            (category) => category.category_name === key
          );
          return matchingCategory ? matchingCategory._id : null;
        })
        .filter((categoryId) => categoryId !== null),
      creator_user: user._id,
      chat_title: titleValue,
      chat_text: textValue,
    };

    try {
      performFetch({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const initialCheckboxValues = categories.reduce((acc, category) => {
      return {
        ...acc,
        [category.category_name]: false,
      };
    }, {});

    setCheckboxValues(initialCheckboxValues);
  }, [categories]);

  return (
    <div>
      <NavMain />
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            placeholder="Write the title here..."
            className="title"
            type="text"
            value={titleValue}
            onChange={handleTitleChange}
            required
          />
          <textarea
            placeholder="Write your question here..."
            className="question-field"
            value={textValue}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="checkbox-button-container">
          <div className="checkbox-container">
            {categories.map((category, index) => {
              if (category.category_name.toLowerCase().includes("all")) {
                return null;
              }
              return (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={category._id}
                    name={category.category_name}
                    checked={checkboxValues[category.category_name] || false}
                    onChange={handleCheckboxChange}
                  />
                  {category.category_name}
                </label>
              );
            })}
          </div>
          <div className="button-wrapper">
            <button
              className="send-question-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </form>
      {error && <p className="error-message">Error: {error.message}</p>}
    </div>
  );
}
