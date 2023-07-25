import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import "./Home.css";
import { Image } from "cloudinary-react";
import NavSignUp from "../../components/NavBars/NavSignUp";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, userError, authError } = useLogin();

  async function handleSubmit(event) {
    event.preventDefault();
    await login(email, password);
  }

  useEffect(() => {
    return () => {};
  }, []);

  let statusComponent = null;
  if (authError != null) {
    statusComponent = (
      <div>Error while trying to login: {authError.toString()}</div>
    );
  } else if (userError != null) {
    statusComponent = (
      <div>Error while trying to fetch user info: {userError.toString()}</div>
    );
  } else if (isLoading) {
    statusComponent = <div>Connecting....</div>;
  }

  return (
    <div className="login-container anim">
      <div className="login">
        <h1>Log in</h1>
        <form className="log-in-form" onSubmit={handleSubmit}>
          <input
            className="input-login"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
          <input
            className="input-login"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
          <div className="button-group">
            <button className="btn-login">Log in</button>
            <Link className="log-in-link" to="/user/signUp">
              Sign Up
            </Link>
          </div>
          <Link to="/user/recovery" className="link-style">
            Forgot password
          </Link>
        </form>
        {statusComponent}
      </div>
      <div className="content-container">
        <h1 className="title-content">Welcome to HackYourFuture Community</h1>
        <p className="content-text">
          We are delighted that you have joined us! We hope you will enjoy your
          stay in our community and find it beneficial for expanding your
          knowledge.
        </p>
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <div className="container">
      <NavSignUp />
      <Login />
      <div className="box">
        <span className="image" style={{ "--1": 1 }}>
          <Image cloudName="dfzxe70hs" publicId="1_natjfy.png" alt="1" />
        </span>
        <span className="image" style={{ "--1": 2 }}>
          <Image cloudName="dfzxe70hs" publicId="2_uhxkzb" alt="2" />
        </span>
        <span className="image" style={{ "--1": 3 }}>
          <Image cloudName="dfzxe70hs" publicId="3_exhk2h" alt="3" />
        </span>
        <span className="image" style={{ "--1": 4 }}>
          <Image cloudName="dfzxe70hs" publicId="4_k74hrq" alt="4" />
        </span>
        <span className="image" style={{ "--1": 5 }}>
          <Image cloudName="dfzxe70hs" publicId="5_hoolrh" alt="5" />
        </span>
        <span className="image" style={{ "--1": 6 }}>
          <Image cloudName="dfzxe70hs" publicId="6_dkvzrt" alt="6" />
        </span>
        <span className="image" style={{ "--1": 7 }}>
          <Image cloudName="dfzxe70hs" publicId="7_eopgyi" alt="7" />
        </span>
        <span className="image" style={{ "--1": 8 }}>
          <Image cloudName="dfzxe70hs" publicId="8_a9ibh6" alt="8" />
        </span>
      </div>
      <div className="footerlandpage">
        <footer>
          <p>
            <b>© 2022 - 2023</b>
          </p>
        </footer>
      </div>
    </div>
  );
};

export { Login, Home };
