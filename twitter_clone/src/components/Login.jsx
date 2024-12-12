import axios from "axios";
import {useContext, useState} from "react";
import "./Login.css";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Login() {
  const [usernameState, setUsernameState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {setIsAuth, setUser} = authContext;

  function onInputUsername(event) {
    const username = event.target.value;
    setUsernameState(username);
  }
  function onInputPassword(event) {
    const password = event.target.value;
    setPasswordState(password);
  }
  const showToastMessage = (message, type) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000, // Auto-close after 5 seconds
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000, // Auto-close after 5 seconds
      });
    }
  };
  async function onSubmit() {
    if (!usernameState || !passwordState) {
      showToastMessage("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/public/user/login", {
        username: usernameState,
        password: passwordState,
      });
      if (response.status === 200 || response.data === "Log in successful") {
        showToastMessage("Login successful!", "success");
        const token = response.data.token;
        const { exp, user } = jwtDecode(token);
        Cookies.set("token", token, {
          expires: new Date(exp * 1000)
        });
          setIsAuth(true);
          setUser(user);
          navigate("/");
      } else {
        // Handle unexpected server response
        showToastMessage("Unexpected error, please try again.", "error");
      }


    } catch (error) {
      if (error.response) {
        // Server responded with a status code other than 2xx
        showToastMessage(
          error.response?.data || "Login failed. Try again.",
          "error"
        );
      } else if (error.request) {
        // No response from server
        showToastMessage(
          "Network error. Please check your connection.",
          "error"
        );
      } else {
        // Something went wrong setting up the request
        showToastMessage("Error occurred. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="login-form">
        <div className="login-form-username">
          <h3>Username:</h3>
          <input
            className="input-field"
            value={usernameState}
            onChange={(event) => onInputUsername(event)}
            disabled={isSubmitting}
          ></input>
        </div>
        <div className="login-form-password">
          <h3>Password:</h3>
          <input
            className="input-field"
            type="password"
            value={passwordState}
            onChange={(event) => onInputPassword(event)}
            disabled={isSubmitting}
          ></input>
        </div>
      </div>
      <button
        className="login-button"
        onClick={() => onSubmit()}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Click to log in"}
      </button>
      <ToastContainer />
    </div>
  );
}
