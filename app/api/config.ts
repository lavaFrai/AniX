export const API_URL = "https://api.anixart.tv";
export const API_PREFIX = "/api";
export const USER_AGENT =
  "AnixartApp/8.2.1-23121216 (Android 9; SDK 28; arm64-v8a; samsung SM-G975N; en)";

export const ENDPOINTS = {
  release: {
    info: `${API_PREFIX}/release`,
    episode: `${API_PREFIX}/episode`,
    related: `${API_PREFIX}/related`,
  },
  user: {
    profile: `${API_PREFIX}/profile`,
    bookmark: `${API_PREFIX}/profile/list`,
    history: `${API_PREFIX}/history`,
    favorite: `${API_PREFIX}/favorite`,
  },
  filter: `${API_PREFIX}/filter`,
  search: `${API_URL}/search`,
  statistic: {
    addHistory: `${API_PREFIX}/history/add`,
    markWatched: `${API_PREFIX}/episode/watch`,
  },
  collection: {
    base: `${API_PREFIX}/collection`,
    list: `${API_PREFIX}/collection/list`,
    create: `${API_PREFIX}/collectionMy/create`,
    delete: `${API_PREFIX}/collectionMy/delete`,
    edit: `${API_PREFIX}/collectionMy/edit`,
    editImage: `${API_PREFIX}/collectionMy/editImage`,
    releaseInCollections: `${API_PREFIX}/collection/all/release`,
    userCollections: `${API_PREFIX}/collection/all/profile`,
    favoriteCollections: `${API_PREFIX}/collectionFavorite`,
  }
};
