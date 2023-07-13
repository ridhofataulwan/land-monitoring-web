import jwtDecode from "jwt-decode";

const TOKEN_KEY = "token";
export const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  return window.localStorage.setItem(TOKEN_KEY, token);
};

export const destroyToken = () => {
  console.log("Token di hapus");
  return window.localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const decodeToken = (token) => {
  return jwtDecode(token);
};
