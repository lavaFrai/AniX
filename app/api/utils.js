import { USER_AGENT } from "./config";
export const HEADERS = {
  "User-Agent": USER_AGENT,
  "Content-Type": "application/json; charset=UTF-8",
};

export const fetchDataViaGet = async (url) => {
  try {
    const response = await fetch(url, {
      headers: HEADERS,
    });
    if (response.status !== 200) {
      throw new Error("Error fetching data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchDataViaPost = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    if (response.status !== 200) {
      throw new Error("Error fetching data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const authorize = async (url, data) => {
  try {
    const response = await fetch(`${url}?login=${data.login}&password=${data.password}`, {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        Sign: "9aa5c7af74e8cd70c86f7f9587bde23d",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.status !== 200) {
      throw new Error("Error authorizing user");
    }
    return await response.json();
  } catch (error) {
    return error;
  }
};

export function setJWT(user_id, jwt) {
  const data = { jwt: jwt, user_id: user_id };
  localStorage.setItem("JWT", JSON.stringify(data));
}
export function getJWT() {
  const data = localStorage.getItem("JWT");
  return JSON.parse(data);
}
export function removeJWT() {
  localStorage.removeItem("JWT");
}
