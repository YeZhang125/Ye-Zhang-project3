import axios from "axios";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Signup.css";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import AuthContext from "./AuthContext";
import {jwtDecode} from "jwt-decode";
export default function Signup() {
  const [usernameState, setUsernameState] = useState("");
  const [fullnameState, setFullnameState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {isAuth, setIsAuth,setUser} = authContext;
  function onInputUsername(event) {
    const username = event.target.value;
    setUsernameState(username);
  }

  function onInputPassword(event) {
    const password = event.target.value;
    setPasswordState(password);
  }

  function onInputFullname(event) {
    const fullname = event.target.value;
    setFullnameState(fullname);
  }

  function onInputEmail(event) {
    const email = event.target.value;
    setEmailState(email);
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
    try {
      const response = await axios.post("/api/public/user/signup", {
        username: usernameState,
        password: passwordState,
        email: emailState,
        fullName: fullnameState,
      });
      if (response.status === 200) { // Check the 'type' field in the response
        showToastMessage('User Successfully created!', 'success');;

        const token = response.data.token;
        const { exp, user } = jwtDecode(token);

        Cookies.set("token", token, {
          expires: new Date(exp * 1000)
        } );
        setIsAuth(true);
        setUser(user);
        navigate("/");
      }
    } catch (error) {
      showToastMessage("Signup failed. Please try again.")
      console.error("Signup failed:", error);
    }
  }

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <div className="signup-form">
        <div>
          <h3>Username:</h3>
          <input
            className="input-field"
            value={usernameState}
            onChange={(event) => onInputUsername(event)}
          ></input>
        </div>
        <div>
          <h3>Full Name:</h3>
          <input
            className="input-field"
            value={fullnameState}
            onChange={(event) => onInputFullname(event)}
          ></input>
        </div>
        <div>
          <h3>Email:</h3>
          <input
            className="input-field"
            value={emailState}
            onChange={(event) => onInputEmail(event)}
          ></input>
        </div>
        <div>
          <h3>Password:</h3>
          <input
            className="input-field"
            type="password"
            value={passwordState}
            onChange={(event) => onInputPassword(event)}
          ></input>
        </div>
      </div>
      <button
        className="signup-button"
        type="button"
        onClick={() => onSubmit()}
      >
        Click here to sign up
      </button>
      <ToastContainer />
    </div>
  );
}
