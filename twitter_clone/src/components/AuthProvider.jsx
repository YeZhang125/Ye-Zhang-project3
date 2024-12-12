
import React from "react";
import {useState} from "react";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
export default function AuthProvider({children}) {
  const [user, setUser] = useState();

  const [isAuth, setIsAuth] = useState(()=>{
    const token = Cookies.get("token");

    if (token) {
      const payload = jwtDecode(token); // Decode the token to get the payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (payload.exp > currentTime) {
        setUser(payload.user);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

  return (
      <AuthContext.Provider value={
        {isAuth, setIsAuth, user, setUser}
      }>
        {children}
      </AuthContext.Provider>
  )
}