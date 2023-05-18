import config from "../config.json";

const baseURL =
  process.env.REACT_APP_EXECUTION === "development"
    ? config.apiDevelopmentUrl
    : config.apiProductionUrl;

class http {
  async get(sufix) {
    return fetch(baseURL + sufix);
  }

  async post(sufix, json) {
    return fetch(baseURL + sufix, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  }

  async put(sufix, json) {
    return fetch(baseURL + sufix, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  }

  async delete(sufix, json) {
    return fetch(baseURL + sufix, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  }
}

http = new http();

export default {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
};
