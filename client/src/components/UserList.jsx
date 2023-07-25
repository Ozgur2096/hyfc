import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import TEST_ID from "../pages/User/UserList.testid";
import PropTypes from "prop-types";
import { FaUserCircle } from "react-icons/fa";

const UserList = ({
  handleUserClick,
  selectedUser,
  avatarIcon,
  unreadUsers,
}) => {
  const [users, setUsers] = useState([]);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user",
    (response) => {
      setUsers(response.result);
    }
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  let content = null;
  if (isLoading) {
    content = (
      <div
        data-testid={TEST_ID.loadingContainer}
        className="loading-spinner"
      ></div>
    );
  } else if (error != null) {
    content = (
      <div data-testid={TEST_ID.errorContainer}>Error: {error.toString()}</div>
    );
  } else {
    content = (
      <ul
        data-testid={TEST_ID.userList}
        data-loaded={users != null}
        className="user-list"
      >
        {users &&
          users
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
            .map((user) => {
              const isSelected = user._id === selectedUser;
              const isUnread = unreadUsers.includes(user._id);
              return (
                <li
                  key={user._id}
                  data-elementid={user._id}
                  className={`user-list-item ${isSelected ? "selected" : ""} ${
                    isUnread ? "unread" : ""
                  }`}
                  onClick={() => handleUserClick(user._id)}
                >
                  {user.image ? (
                    <img
                      className="user-chat-img"
                      src={user.image}
                      alt="User"
                    />
                  ) : (
                    avatarIcon
                  )}
                  {user.firstName} {user.lastName} {user.role}{" "}
                  {user.hyfClass ? "Class " + user.hyfClass : null}
                </li>
              );
            })}
      </ul>
    );
  }

  return (
    <div data-testid={TEST_ID.container} className="user-list-container">
      {content}
    </div>
  );
};

UserList.propTypes = {
  handleUserClick: PropTypes.func,
  selectedUser: PropTypes.string,
  avatarIcon: PropTypes.node,
  unreadUsers: PropTypes.arrayOf(PropTypes.string),
};

UserList.defaultProps = {
  avatarIcon: <FaUserCircle />,
};

export default UserList;
