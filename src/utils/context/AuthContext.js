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
  const value = { user, updateAuthUser: handleSetUser };
  useEffect(() => {
    if (
      accessToken ||
      (localStorage.getItem("Restaurant-Account") !== undefined &&
        localStorage.getItem("Restaurant-Account") !== "undefined" &&
        localStorage.getItem("Restaurant-Account") !== null &&
        localStorage.getItem("Restaurant-Account") !== "null")
    ) {
      const localUser =
        accessToken?.AccessToken || JSON.parse(localStorage.getItem("Restaurant-Account"));
      if (localUser) {
        const getAccount = async () => {
          const res = await getUserByAccessToken(localUser.accessToken);
          if (res?.data) {
            setUser({
              ...res.data?.customer,
              cusId: res.data?.customer?._id,
              ...res.data?.account,
            });
          }
        };
        getAccount();
      }
    } else {
      setUser(null);
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
