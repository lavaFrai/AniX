export const API_URL = "https://api.anixart.tv";
export const API_PREFIX = "/api";
export const USER_AGENT =
  "AnixartApp/8.2.1-23121216 (Android 11; SDK 30; arm64-v8a;)";

export const ENDPOINTS = {
  release: {
    info: `${API_PREFIX}/release`,
    episode: `${API_PREFIX}/episode`,
  },
  user: {
    profile: `${API_PREFIX}/profile`,
    bookmark: `${API_PREFIX}/profile/list`,
    history: `${API_PREFIX}/history`,
    favorite: `${API_PREFIX}/favorite`,
  },
  filter: `${API_PREFIX}/filter`,
  // user: {
  //   history: `${API_PREFIX}/history`,
  //   watching: `${API_PREFIX}/profile/list/all/1`,
  //   planned: `${API_PREFIX}/profile/list/all/2`,
  //   watched: `${API_PREFIX}/profile/list/all/3`,
  //   delayed: `${API_PREFIX}/profile/list/all/4`,
  //   abandoned: `${API_PREFIX}/profile/list/all/5`,
  //   favorite: `${API_PREFIX}/favorite`,
  // },
  search: `${API_URL}/search`,
  statistic: {
    addHistory: `${API_PREFIX}/history/add`,
    markWatched: `${API_PREFIX}/episode/watch`,
  },
};
