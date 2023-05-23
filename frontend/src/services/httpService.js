import config from "../config.json";

const baseURL =
  process.env.REACT_APP_EXECUTION === "development"
    ? config.apiDevelopmentUrl
    : config.apiProductionUrl;

async function get(sufix) {
  return await fetch(baseURL + sufix, {
    headers: {
      "x-auth-token": getLocalToken(),
    },
  });
}

async function post(sufix, json) {
  const token = getLocalToken();
  return await fetch(baseURL + sufix, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify(json),
  });
}

async function put(sufix, json) {
  return await fetch(baseURL + sufix, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": getLocalToken(),
    },
    body: JSON.stringify(json),
  });
}

async function http_delete(sufix, json) {
  return await fetch(baseURL + sufix, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": getLocalToken(),
    },
    body: JSON.stringify(json),
  });
}

async function getToken(sufix, json) {
  const response = await fetch(baseURL + sufix, {
    method: "POST",
    body: `grant_type=password&username=${json.username}&password=${json.password}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return await response.json();
}

async function createUser(sufix, json) {
  const response = await fetch(baseURL + sufix, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
  return await response.json();
}

function getLocalToken() {
  return localStorage.getItem("token");
}

export default {
  get,
  post,
  put,
  http_delete,
  getToken,
  createUser,
};
