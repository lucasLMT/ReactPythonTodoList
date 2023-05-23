import http from "./httpService";
import jwt_decode from "jwt-decode";

const apiEndpoint = "services/";

export async function userLogin(email, password) {
  const json = await http.getToken(apiEndpoint + "user/token", {
    username: email,
    password: password,
  });
  localStorage.setItem("token", json.access_token);
  const decoded = jwt_decode(json.access_token);
  return decoded;
}

export async function socialLogin(googleId, email, picture_url) {
  const json = await http.createUser(apiEndpoint + "user/social", {
    googleId: googleId,
    email: email,
    password: "",
    picture_url: picture_url,
  });
  localStorage.setItem("token", json.access_token);
  return jwt_decode(json.access_token);
}

export async function createUser(email, password) {
  const json = await http.createUser(apiEndpoint + "user/register", {
    email: email,
    password: password,
  });
  localStorage.setItem("token", json.access_token);
  return json;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    const decodedJwt = jwt_decode(token);
    return decodedJwt.exp * 1000 > Date.now() ? decodedJwt : null;
  } catch (ex) {
    return null;
  }
}
