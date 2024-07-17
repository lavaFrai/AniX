import { USER_AGENT } from "./config";
export const HEADERS = {
  "User-Agent": USER_AGENT,
  "Content-Type": "application/json; charset=UTF-8",
};

export const fetchDataViaGet = async (url, API_V2) => {
  if (API_V2) {
    HEADERS["API-Version"] = "v2";
  }
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

export const fetchDataViaPost = async (url, body, API_V2) => {
  if (API_V2) {
    HEADERS["API-Version"] = "v2";
  }
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
    const response = await fetch(
      `${url}?login=${data.login}&password=${data.password}`,
      {
        method: "POST",
        headers: {
          "User-Agent": USER_AGENT,
          Sign: "9aa5c7af74e8cd70c86f7f9587bde23d",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
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

export function numberDeclension(number, one, two, five) {
  if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return five;
  let last_num = number % 10;
  if (last_num == 1) return one;
  if ([2, 3, 4].includes(last_num)) return two;
  if ([5, 6, 7, 8, 9, 0].includes(last_num)) return five;
}

export function sinceUnixDate(unixInSeconds) {
  const unix = Math.floor(unixInSeconds * 1000);
  const date = new Date(unix);
  const currentDate = new Date().valueOf();
  const dateDifferenceSeconds = new Date(currentDate - unix) / 1000;

  const minutes = Math.floor(dateDifferenceSeconds / 60)
  const hours = Math.floor(dateDifferenceSeconds / 3600);
  const days = Math.floor(dateDifferenceSeconds / 86400);

  const minutesName = numberDeclension(minutes, "минута", "минуты", "минут");
  const hoursName = numberDeclension(hours, "час", "часа", "часов");
  const daysName = numberDeclension(days, "день", "дня", "дней");

  if (dateDifferenceSeconds < 60) return "менее минуты назад";
  if (dateDifferenceSeconds < 3600)
    return `${minutes} ${minutesName} назад`;
  if (dateDifferenceSeconds < 86400)
    return `${hours} ${hoursName} назад`;
  if (dateDifferenceSeconds < 2592000)
    return `${days} ${daysName} назад`;

  return date.toLocaleString("ru-RU").split(",")[0];
}
