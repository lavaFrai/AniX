export const CURRENT_APP_VERSION = "3.2.0";

export const API_URL = "https://api.anixart.tv";
export const API_PREFIX = "/api/proxy";
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
    settings: {
      my: `${API_PREFIX}/profile/preference/my`,
      login: {
        info: `${API_PREFIX}/profile/preference/login/info`,
        history: `${API_PREFIX}/profile/login/history/all`, // /<user_id>/<page>
        change: `${API_PREFIX}/profile/preference/login/change`, // ?login=<url_encoded_string>
      },
      statusEdit: `${API_PREFIX}/profile/preference/status/edit`,
      statsEdit: `${API_PREFIX}/profile/preference/privacy/stats/edit`,
      countsEdit: `${API_PREFIX}/profile/preference/privacy/counts/edit`,
      socialEdit: `${API_PREFIX}/profile/preference/privacy/social/edit`,
      friendRequestsEdit: `${API_PREFIX}/profile/preference/privacy/friendRequests/edit`,
    }
  },
  filter: `${API_PREFIX}/filter`,
  search: `${API_URL}/search`,
  statistic: {
    addHistory: `${API_PREFIX}/history/add`,
    markWatched: `${API_PREFIX}/episode/watch`,
  },
  collection: {
    base: `${API_PREFIX}/collection`,
    addRelease: `${API_PREFIX}/collectionMy/release/add`,
    create: `${API_PREFIX}/collectionMy/create`,
    delete: `${API_PREFIX}/collectionMy/delete`,
    edit: `${API_PREFIX}/collectionMy/edit`,
    editImage: `${API_PREFIX}/collectionMy/editImage`,
    releaseInCollections: `${API_PREFIX}/collection/all/release`,
    userCollections: `${API_PREFIX}/collection/all/profile`,
    favoriteCollections: `${API_PREFIX}/collectionFavorite`,
  }
};
