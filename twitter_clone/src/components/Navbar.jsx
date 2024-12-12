import React, {useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";
import AuthContext from "./AuthContext";
import defaultAvatar from "../assets/default_profile.png";
import {useNavigate} from "react-router-dom";
export default function Navbar() {
  const authContext = useContext(AuthContext);
  const { isAuth, setIsAuth, user} = authContext;


  const handleLogout = () => {
    Cookies.remove("token");
    setIsAuth(false);
  };

  return (
    <nav className="navbar">
      <Link to="/">
      <h1 className="logo">X</h1>
        </Link>
      <div className="nav-links">
        <li>
          <Link to="/">Homepage</Link>
        </li>
        {!isAuth ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        ) : (
            <>
              <li>
                <span onClick={() => handleLogout()}>Log Out</span>
              </li>
              <li className="user-info">
                <Link to={`/user/${user._id}`}>
                  {user.username}
                  <img
                      src={defaultAvatar} // Replace with a valid image source
                      alt="Avatar"
                      className="avatar-icon"
                  />
                </Link>
              </li>

            </>
        )}
      </div>
    </nav>
  );
}
