// import { createContext } from "react";

import { getUserByAccessToken } from "utils/api";

// export const AuthContext = createContext({
//   updateAuthUser: () => {},
// });

const { useContext, createContext, useState, useEffect } = require("react");

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const handleSetUser = (accessToken) => {
    localStorage.removeItem("Restaurant-Account");
    if (accessToken) {
      localStorage.setItem("Restaurant-Account", JSON.stringify(accessToken));
    }
    setAccessToken(accessToken);
  };
  console.log(accessToken);
  const value = { user, updateAuthUser: handleSetUser };
  useEffect(() => {
    console.log("useEffect runned");
    console.log(localStorage.getItem("Restaurant-Account"));
    if (
      (localStorage.getItem("Restaurant-Account") !== undefined &&
        localStorage.getItem("Restaurant-Account") !== "undefined" &&
        localStorage.getItem("Restaurant-Account") !== null) ||
      accessToken
    ) {
      const localUser =
        accessToken?.AccessToken || JSON.parse(localStorage.getItem("Restaurant-Account"));
      if (localUser) {
        const getAccount = async () => {
          const res = await getUserByAccessToken(localUser.accessToken);
          if (res.data) {
            setUser({ ...res.data?.account, ...res.data?.customer });
          }
        };
        getAccount();
      }
    } else {
      setUser(null);
      console.log("user is null");
    }
  }, [accessToken]);
  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (typeof context === "undefined") {
    throw new Error("useAuthContext must be used in AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthContext };
