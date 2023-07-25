import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./components/UserList";
import { ManageProfile } from "./pages/User/ManageProfile";
import { Questions } from "./pages/Questions/Questions";
import Recovery from "./pages/User/Recovery";
import { Home } from "./pages/Home/Home";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import { useAuthContext } from "./hooks/useAuthContext";
import "./App.css";
import { QuestionView } from "./pages/QuestionsView/QuestionView";
import { PrivateChatRoom } from "./pages/PrivateChatRoom/PrivateChatRoom";

const App = () => {
  const { auth } = useAuthContext();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={auth ? <UserList /> : <Navigate to="/" />} />
      <Route
        path="/user/signUp"
        element={!auth ? <CreateUser /> : <Navigate to="/questions" />}
      />
      <Route
        path="/user/profile"
        element={auth ? <ManageProfile /> : <Navigate to="/" />}
      />
      <Route
        path="/questions"
        element={auth ? <Questions /> : <Navigate to="/" />}
      />
      <Route
        path="/questions/:questionId"
        element={auth ? <QuestionView /> : <Navigate to="/" />}
      />
      <Route
        path="/user/recovery"
        element={!auth ? <Recovery /> : <Navigate to="/" />}
      />
      <Route
        path="/ask"
        element={auth ? <AskQuestion /> : <Navigate to="/" />}
      />
      <Route
        path="/private-chat"
        element={auth ? <PrivateChatRoom /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
