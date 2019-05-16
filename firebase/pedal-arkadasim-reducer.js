import firebase from "react-native-firebase";
import { AccessToken, LoginManager } from "react-native-fbsdk";

import ImagePicker from "react-native-image-crop-picker";
import OneSignal from "react-native-onesignal";

export const GET_REPOS = "my-awesome-app/repos/LOAD";
export const GET_REPOS_SUCCESS = "my-awesome-app/repos/LOAD_SUCCESS";
export const GET_REPOS_FAIL = "my-awesome-app/repos/LOAD_FAIL";
export const NAVIGATE = "core/navigate";
export const TAB_NAVIGATE = "core/tab_navigate";
export const OPENCLOSE_HAMBURGER_MENU = "core/openCloseHamburgerMenu";
export const SET_ARRAY_DATA = "core/setArrayData";
export const ADD_ARRAY_DATA = "core/addArrayData";
export const SET_ITEM_CONTENT = "core/setItemContent";
export const SET_STRING = "core/setString";
export const REFRESH_PROFILE_EDIT_STATE = "core/refreshProfileEditState";
export const CACHE_ANNOUCEMENT = "core/cacheAnnoucement";
export const LOAD_CACHE_ANNOUCEMENT = "core/loadCacheAnnoucement";
export const MOVE_ABOUT_PAGE = "core/moveAboutPage";
export const PUSH = "core/push";
export const REMOVE_VALUE = "core/removeValue";
export const KEY_VALUE = "core/keyValue";
export const MOVE_SSS_PAGE = "core/moveSSSPage";
export const SET_ARRAY_ELEMENT = "core/setArrayElement";
export const SORT_ARRAY_BY_FIELD = "core/sortArrayByField";

export const SCREEN_LOGIN = 1;
export const SCREEN_EMAIL_LOGIN = 2;
export const SCREEN_FORGOTPASSWORD = 3;
export const SCREEN_SIGNUP = 4;
export const SCREEN_PASSWORD_EMAIL_VALIDATION = 5;
export const SCREEN_CHANGE_PASSWORD = 6;
export const SCREEN_EMAIL_VALIDATION = 7;
export const SCREEN_MAIN = 8;
export const SCREEN_INTRO_1 = 9001;
export const SCREEN_INTRO_2 = 9002;
export const SCREEN_INTRO_3 = 9003;
export const SCREEN_ABOUT_US = 1001;
export const SCREEN_SSS = 11;

function getProfileKeys() {
  return [
    "name",
    "gsm",
    "yemek",
    "acilName",
    "acilGSM",
    "bodyInfoShare",
    "kan",
    "engelDurumu",
    "bisikletTuru",
    "bisikletAmac",
    /*"nedenBiz",*/ "nereyeGidelim",
    "bisikletHakimiyet",
    "sohbet",
    "boy",
    "kilo",
    "beden"
  ];
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function calcRemainSeats(o) {
  var usedCnt = 0;
  for (var i = 0; i < o.seats.length; i++) {
    if (o.seats[i].on) {
      usedCnt++;
    }
    if (o.seats[i].arka) {
      usedCnt++;
    }
  }
  var total = o.seats.length * 2;
  var remain = total - usedCnt;
  return remain;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const SERVER_BASE_URL = "http://207.154.205.61:3000";

export default function reducer(
  state = {
    currentTab: 1,
    isHamburgerMenuOpened: false,
    all_loaded_pedalarkadasim: false,
    all_loaded_engelsizpedal: false,
    announcementsCache_pedalarkadasim: [],
    announcementsCache_engelsizpedal: [],
    announcement: null,
    announcements: [],
    events: [],
    event: null,
    viewingProfile: null,
    activeAnnoucementSegment: "pedalarkadasim",
    activeEventSegment: "takvim",
    loginFormState: "clean",
    signupFormState: "clean",
    emailValidationState: "clean",
    passwordEmailValidationState: "clean",
    passwordCodeValidationState: "clean",
    changePasswordState: "clean",
    profileState: "clean",
    profileEditState: "normal",
    editState_name: "view",
    profile_name: "(Belirtilmemiş)",
    new_name: "(Belirtilmemiş)",
    editState_yemek: "view",
    profile_yemek: "(Belirtilmemiş)",
    new_yemek: "(Belirtilmemiş)",
    editState_gsm: "view",
    profile_gsm: "(Belirtilmemiş)",
    new_gsm: "(Belirtilmemiş)",
    editState_acilName: "view",
    profile_acilName: "(Belirtilmemiş)",
    new_acilName: "(Belirtilmemiş)",
    editState_acilGSM: "view",
    profile_acilGSM: "(Belirtilmemiş)",
    new_acilGSM: "(Belirtilmemiş)",
    editState_bodyInfoShare: "view",
    profile_bodyInfoShare: "(Belirtilmemiş)",
    new_bodyInfoShare: "(Belirtilmemiş)",
    editState_sohbet: "view",
    profile_sohbet: "(Belirtilmemiş)",
    new_sohbet: "(Belirtilmemiş)",
    editState_bisikletHakimiyet: "view",
    profile_bisikletHakimiyet: "(Belirtilmemiş)",
    new_bisikletHakimiyet: "(Belirtilmemiş)",
    editState_nereyeGidelim: "view",
    profile_nereyeGidelim: "(Belirtilmemiş)",
    new_nereyeGidelim: "(Belirtilmemiş)",
    // editState_nedenBiz:"view",
    // profile_nedenBiz:"(Belirtilmemiş)",
    // new_nedenBiz:"(Belirtilmemiş)",
    editState_bisikletAmac: "view",
    profile_bisikletAmac: "(Belirtilmemiş)",
    new_bisikletAmac: "(Belirtilmemiş)",
    editState_bisikletTuru: "view",
    profile_bisikletTuru: "(Belirtilmemiş)",
    new_bisikletTuru: "(Belirtilmemiş)",
    editState_engelDurumu: "view",
    profile_engelDurumu: "(Belirtilmemiş)",
    new_engelDurumu: "(Belirtilmemiş)",
    editState_kan: "view",
    profile_kan: "(Belirtilmemiş)",
    new_kan: "(Belirtilmemiş)",
    editState_beden: "view",
    profile_beden: "(Belirtilmemiş)",
    new_beden: "(Belirtilmemiş)",
    editState_kilo: "view",
    profile_kilo: "(Belirtilmemiş)",
    new_kilo: "(Belirtilmemiş)",
    editState_boy: "view",
    profile_boy: "(Belirtilmemiş)",
    new_boy: "(Belirtilmemiş)",
    backId: -1,
    changePasswordEmail: null,
    changePasswordCode: null,
    profileImage: "",
    profileImageModal: false,
    filterStartDate: null,
    filterEndDate: null,
    filterLocation: null,
    filterLocationTitle: null,
    filterPanelOpen: true,
    teknikPoints: [],
    announcementPos_pedalarkadasim: 0,
    announcementPos_engelsizpedal: 0,
    lastAnnoucement: "pedalarkadasim",
    videos: [],
    video: null,
    aboutUsPages: [],
    sssPages: [],
    currentAboutUsPage: 0,
    currentSSSPage: 0,
    remindMe: [],
    eventPage: 0,
    seatInfo: {},
    selectedSeat: null,
    friendProfileImage: null,
    friendProfileName: null,
    friendProfileId: null,
    resultText: "",
    viewingProfileSource: null,
    myEvents: { reminders: [], particips: [], history: [] },
    navigationStack: [],
    eventDetailSource: "",
    profileAgreed: false,
    userAgreed: false
  },
  action
) {
  switch (action.type) {
    case GET_REPOS:
      return { ...state, loading: true };
    case GET_REPOS_SUCCESS:
      return { ...state, loading: false, repos: action.payload.data };
    case GET_REPOS_FAIL:
      return { ...state, loading: false, error: action.payload.error };
    case NAVIGATE:
      var newState = { ...state, backId: action.backId };
      newState.navigationStack = [
        ...newState.navigationStack,
        { type: "screen", value: newState.screen }
      ];
      newState.screen = action.to;
      return newState;
    case TAB_NAVIGATE:
      var newState = { ...state, isHamburgerMenuOpened: false };
      newState.navigationStack = [
        ...newState.navigationStack,
        { type: "tab", value: newState.currentTab }
      ];
      newState.currentTab = action.to;
      return newState;
    case OPENCLOSE_HAMBURGER_MENU:
      var cv = state.isHamburgerMenuOpened;
      var newState = {
        ...state,
        isHamburgerMenuOpened: !state.isHamburgerMenuOpened
      };
      newState.navigationStack = [
        ...newState.navigationStack,
        { type: "menu", value: cv }
      ];
      return newState;
    case SET_ARRAY_DATA:
      var newState = { ...state };
      var arr = [];
      for (var k in action.data) {
        if (action.data[k] != null) {
          var item = Object.assign({}, action.data[k], {
            key: k
          });
          arr.push(item);
        }
      }
      newState[action.field] = arr;
      return newState;
    case ADD_ARRAY_DATA:
      var newState = { ...state };
      var arr = [];
      for (var k in action.data) {
        var item = Object.assign({}, action.data[k], {
          key: k
        });
        arr.push(item);
      }
      newState[action.field] = newState[action.field].concat(arr);
      return newState;
    case PUSH:
      var newState = { ...state };
      newState[action.field] = [...newState[action.field], action.data];
      return newState;
    case SET_ITEM_CONTENT:
      var newState = { ...state };
      var fieldsStr = action.field + "s";
      var obj = null;
      if (action.key != null) {
        for (var i = 0; i < newState[fieldsStr].length; i++) {
          if (newState[fieldsStr][i].key == action.key) {
            obj = newState[fieldsStr][i];
            break;
          }
        }
      }
      newState[action.field] = obj;
      return newState;
    case SET_STRING:
      var newState = { ...state };
      if (typeof newState[action.key] != "undefined") {
        newState[action.key] = action.value;
      }
      return newState;
    case REFRESH_PROFILE_EDIT_STATE:
      var profileKeys = getProfileKeys();
      var s = "normal";
      for (var i = 0; i < profileKeys.length; i++) {
        if (state["editState_" + profileKeys[i]] != "view") {
          console.log(
            state["editState_" + profileKeys[i]],
            state["new_" + profileKeys[i]],
            profileKeys[i]
          );
          s = "edit";
          break;
        }
      }
      return { ...state, profileEditState: s };
    case CACHE_ANNOUCEMENT:
      var s = state.activeAnnoucementSegment;
      var newState = { ...state };
      newState["announcementsCache_" + s] = [...state.announcements];
      return newState;
    case LOAD_CACHE_ANNOUCEMENT:
      var newState = { ...state };
      newState.announcements = [...action.data];
      return newState;
    case REMOVE_VALUE:
      var newState = { ...state };
      var arr = [];
      for (var i = 0; i < newState[action.field].length; i++) {
        if (newState[action.field][i] !== action.data) {
          arr.push(newState[action.field][i]);
        }
      }
      newState[action.field] = arr;
      return newState;
    case MOVE_SSS_PAGE:
      var newState = { ...state };
      var newIndex = state.currentSSSPage + action.distance;
      if (newIndex < 0 || newIndex >= state.sssPages.length) {
        newState.screen = SCREEN_MAIN;
      } else {
        newState.currentSSSPage = newIndex;
      }
      return newState;
    case MOVE_ABOUT_PAGE:
      var newState = { ...state };
      var newIndex = state.currentAboutUsPage + action.distance;
      if (newIndex < 0 || newIndex >= state.aboutUsPages.length) {
        newState.screen = SCREEN_MAIN;
      } else {
        newState.currentAboutUsPage = newIndex;
      }
      return newState;
    case KEY_VALUE:
      var newState = { ...state };
      newState[action.field] = Object.assign({}, newState[action.field], {});
      newState[action.field][action.key] = action.value;
      return newState;
    case SET_ARRAY_ELEMENT:
      var newState = { ...state };
      var arr = [...newState[action.field]];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].key == action.key) {
          arr[i] = { ...action.value };
        }
      }
      newState[action.field] = arr;
      return newState;
    case SORT_ARRAY_BY_FIELD:
      var newState = { ...state };
      if (action.key == null) {
        if (isReversed) {
          newState[action.field].reverse();
        } else {
          newState[action.field].sort();
        }
      } else if (action.isReversed) {
        newState[action.field].sort(function(a, b) {
          if (a[action.key] > b[action.key]) return -1;
          else if (b[action.key] > a[action.key]) return 1;
          else return 0;
        });
      } else {
        newState[action.field].sort(function(a, b) {
          if (a[action.key] > b[action.key]) return 1;
          else if (b[action.key] > a[action.key]) return -1;
          else return 0;
        });
      }
      return newState;
    default:
      return state;
  }
}

export function sortArrayByField(field, key, isReversed = false) {
  return {
    type: SORT_ARRAY_BY_FIELD,
    field: field,
    key: key,
    isReversed: isReversed
  };
}

export function setArrayElement(field, key, value) {
  return {
    type: SET_ARRAY_ELEMENT,
    field: field,
    key: key,
    value: value
  };
}

export function listRepos(user) {
  return {
    type: GET_REPOS,
    payload: {
      request: {
        url: `/users/${user}/repos`
      }
    }
  };
}

export function navigate(screenId, backId = -1) {
  return {
    type: NAVIGATE,
    to: screenId,
    backId: backId
  };
}

export function switchTab(tabID) {
  return {
    type: TAB_NAVIGATE,
    to: tabID
  };
}

export function openCloseHamburger() {
  return {
    type: OPENCLOSE_HAMBURGER_MENU
  };
}

export function setArrayData(field, data) {
  return {
    type: SET_ARRAY_DATA,
    field: field,
    data: data
  };
}

export function addArrayData(field, data) {
  return {
    type: ADD_ARRAY_DATA,
    field: field,
    data: data
  };
}

export function setItem(field, key) {
  return {
    type: SET_ITEM_CONTENT,
    field: field,
    key: key
  };
}

export function setAnnouncementSegment(segment) {
  return {
    type: SET_STRING,
    key: "activeAnnoucementSegment",
    value: segment
  };
}

export function setEventSegment(segment) {
  return {
    type: SET_STRING,
    key: "activeEventSegment",
    value: segment
  };
}

export function setNewProfile(key, value) {
  return {
    type: SET_STRING,
    key: "new_" + key,
    value: value
  };
}

export function setString(key, value) {
  return {
    type: SET_STRING,
    key: key,
    value: value
  };
}

export function refreshProfileEditState() {
  return {
    type: REFRESH_PROFILE_EDIT_STATE
  };
}

export function selectProfilePicture(v) {
  return {
    type: SET_STRING,
    key: "profileImageModal",
    value: v
  };
}

export function cacheAnnoucements() {
  return {
    type: CACHE_ANNOUCEMENT
  };
}

export function loadCacheAnnoucement(data) {
  return {
    type: LOAD_CACHE_ANNOUCEMENT,
    data: data
  };
}

export function moveAboutPage(dist) {
  return {
    type: MOVE_ABOUT_PAGE,
    distance: dist
  };
}

export function moveSSSPage(dist) {
  return {
    type: MOVE_SSS_PAGE,
    distance: dist
  };
}

export function push(field, data) {
  return {
    type: PUSH,
    field: field,
    data: data
  };
}

export function removeValue(field, data) {
  return {
    type: REMOVE_VALUE,
    field: field,
    data: data
  };
}

export function setKeyValue(field, key, value) {
  return {
    type: KEY_VALUE,
    field: field,
    key: key,
    value: value
  };
}

export const profileAgreed = () => {
  return function(dispatch) {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .update({ profileAgreed: true })
      .then(function() {
        dispatch(setString("profileAgreed", true));
      });
  };
};

export const userAgreed = () => {
  return function(dispatch) {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .update({ userAgreed: true })
      .then(function() {
        dispatch(setString("userAgreed", true));
      });
  };
};

export const loginWithEmail = (email, password) => {
  return function(dispatch) {
    dispatch(setString("loginFormState", "loading"));
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function(response) {
        firebase
          .database()
          .ref("users/" + response.user.uid)
          .once("value")
          .then(function(snapshot) {
            dispatch(setString("loginFormState", "clean"));

            if (snapshot.val().emailValidationCode != "-1") {
              dispatch(navigate(SCREEN_EMAIL_VALIDATION, SCREEN_LOGIN));
            } else {
              dispatch(navigate(SCREEN_MAIN));
            }
          });
      })
      .catch(function(error) {
        dispatch(setString("loginFormState", "error"));
      });
  };
};

export const validateEmail = code => {
  return function(dispatch) {
    dispatch(setString("emailValidationState", "loading"));
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/emailValidationCode")
      .once("value")
      .then(function(snapshot) {
        if (snapshot.val() == code) {
          firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid)
            .update({
              emailValidationCode: "-1"
            })
            .then(function() {
              dispatch(setString("emailValidationState", "clean"));
              dispatch(navigate(SCREEN_MAIN));
            });
        } else {
          dispatch(setString("emailValidationState", "error"));
        }
      });
  };
};

export const signupUp = (email, name, password, password2) => {
  if (
    email.trim() == "" ||
    name.trim() == "" ||
    password.trim() == "" ||
    password2.trim() == ""
  ) {
    return setString("signupFormState", "error_0");
  }

  if (password.trim() != password2.trim()) {
    return setString("signupFormState", "error_1");
  }

  return function(dispatch) {
    dispatch(setString("signupFormState", "loading"));
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.trim(), password.trim())
      .then(function(response) {
        firebase
          .database()
          .ref("users/" + response.user.uid)
          .update({
            name: name.trim(),
            email: email.trim(),
            profileAgreed: false,
            userAgreed: false
          });

        fetch(
          SERVER_BASE_URL +
            "/send_verification_mail?uid=" +
            response.user.uid +
            "&email=" +
            email
        )
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.result == "ok") {
              dispatch(setString("signupFormState", "clean"));
              dispatch(navigate(SCREEN_EMAIL_VALIDATION, SCREEN_SIGNUP));
            }
          })
          .catch(error => {
            dispatch(setString("signupFormState", "clean"));
            console.error("send_verification_mail server error", error);
          });
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        switch (errorCode) {
          case "auth/invalid-email":
            dispatch(setString("signupFormState", "error_2"));
            break;
          case "auth/email-already-in-use":
            dispatch(setString("signupFormState", "error_3"));
            break;
          case "auth/weak-password":
            dispatch(setString("signupFormState", "error_4"));
            break;
        }
      });
  };
};

export const emailValidationForPassword = email => {
  if (email.trim() == "") {
    return setString("passwordEmailValidationState", "error");
  }
  return function(dispatch) {
    dispatch(setString("passwordEmailValidationState", "loading"));

    fetch(SERVER_BASE_URL + "/send_verification_passwordmail?email=" + email)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.result == "ok") {
          dispatch(setString("changePasswordEmail", email));
          dispatch(setString("passwordEmailValidationState", "clean"));
          dispatch(navigate(SCREEN_PASSWORD_EMAIL_VALIDATION));
        }
      })
      .catch(error => {
        dispatch(setString("passwordEmailValidationState", "clean"));
        console.error("send_verification_passwordmail server error", error);
      });
  };
};

export const sendPasswordChangeCode = code => {
  if (code.trim() == "") {
    return setString("passwordCodeValidationState", "error");
  }
  return function(dispatch, getState) {
    dispatch(setString("passwordCodeValidationState", "loading"));

    fetch(
      SERVER_BASE_URL +
        "/check_password_validation?code=" +
        code +
        "&email=" +
        getState().changePasswordEmail
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.result == "ok") {
          dispatch(setString("changePasswordCode", code));
          dispatch(setString("passwordCodeValidationState", "clean"));
          dispatch(navigate(SCREEN_CHANGE_PASSWORD));
        } else {
          dispatch(setString("passwordCodeValidationState", "error"));
        }
      })
      .catch(error => {
        dispatch(setString("passwordCodeValidationState", "clean"));
        console.error("check_password_validation server error", error);
      });
  };
};

export const changePassword = (password, password2) => {
  if (password.trim() == "" || password2.trim() == "") {
    return setString("signupFormState", "error_2");
  }

  if (password.trim() != password2.trim()) {
    return setString("signupFormState", "error_0");
  }

  return function(dispatch, getState) {
    dispatch(setString("changePasswordState", "loading"));

    fetch(
      SERVER_BASE_URL +
        "/set_password?password=" +
        password +
        "&code=" +
        getState().changePasswordCode +
        "&email=" +
        getState().changePasswordEmail
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.result == "ok") {
          dispatch(setString("changePasswordState", "clean"));
          dispatch(navigate(SCREEN_EMAIL_LOGIN));
        } else {
          dispatch(
            setString("changePasswordState", "error_" + responseJson.errorCode)
          );
        }
      })
      .catch(error => {
        dispatch(setString("changePasswordState", "clean"));
        console.error("check_password_validation server error", error);
      });
  };
};

export const signOut = () => {
  return function(dispatch) {
    dispatch(navigate(SCREEN_LOGIN));
    firebase
      .auth()
      .signOut()
      .catch(function() {});
  };
};

export const fetchAnnoucements = () => {
  //this.props.activeAnnoucementSegment

  return function(dispatch, getState) {
    var cache = getState()[
      "announcementsCache_" + getState().activeAnnoucementSegment
    ];
    if (cache.length > 0) {
      dispatch(loadCacheAnnoucement(cache));
      dispatch(
        setString("lastAnnoucement", getState().activeAnnoucementSegment)
      );
      return;
    }

    firebase
      .database()
      .ref("announcement/" + getState().activeAnnoucementSegment)
      .orderByChild("date")
      .limitToLast(10)
      .once("value")
      .then(snapshot => {
        dispatch(setArrayData("announcements", snapshot.val()));
        dispatch(sortArrayByField("announcements", "date", true));
        dispatch(
          setString("lastAnnoucement", getState().activeAnnoucementSegment)
        );
      })
      .catch(error => {});
  };
};

export const fetchMoreAnnoucements = () => {
  return function(dispatch, getState) {
    if (getState()["all_loaded_" + getState().activeAnnoucementSegment]) return;
    var endKey = getState().announcements[getState().announcements.length - 1]
      .date;
    endKey = String(endKey);
    firebase
      .database()
      .ref("announcement/" + getState().activeAnnoucementSegment)
      .orderByChild("date")
      .endAt(endKey - 1)
      .limitToLast(10)
      .once("value")
      .then(snapshot => {
        /* var obj = snapshot.val();
console.log("obj",obj);
          var toDelete = [];
          for(var k in obj){
            var l = getState().announcements.length;
            for(var i = 0; i < l; i++){
              if(getState().announcements[i].key == k){
                toDelete.push(k);
              }
            }
          }
          for(var i = 0; i < toDelete.length; i++){
            delete obj[toDelete[i]];
          }
console.log("obj",obj);
           var finish = true;
           for(var k in obj){
             finish = false;
             break;
           }
          if(finish){
            dispatch(setString("all_loaded_"+getState().activeAnnoucementSegment),true);
            return;
          }*/
        dispatch(addArrayData("announcements", snapshot.val()));
        dispatch(sortArrayByField("announcements", "date", true));
      })
      .catch(error => {});
  };
};

export const fetchVideos = () => {
  return function(dispatch, getState) {
    firebase
      .database()
      .ref("videos")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        dispatch(setArrayData("videos", snapshot.val()));
        dispatch(sortArrayByField("videos", null, true));
      })
      .catch(error => {});
  };
};

export const fetchEvents = () => {
  return function(dispatch, getState) {
    if (getState()["activeEventSegment"] == "takvim") {
      firebase
        .database()
        .ref("event")
        .orderByChild("date")
        .startAt(Date.now())
        .once("value")
        .then(snapshot => {
          console.log(snapshot.val());
          dispatch(setArrayData("events", snapshot.val()));
          dispatch(sortArrayByField("events", "date"));
        })
        .catch(error => {});
    }
  };
};

export const loadAboutUs = () => {
  return function(dispatch, getState) {
    dispatch(setString("currentAboutUsPage", 0));
    if (getState().aboutUsPages.length != 0) return;
    firebase
      .database()
      .ref("static-data/about-us")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        dispatch(setArrayData("aboutUsPages", snapshot.val()));
      })
      .catch(error => {});
  };
};

export const loadSSS = () => {
  return function(dispatch, getState) {
    dispatch(setString("currentSSSPage", 0));
    if (getState().sssPages.length != 0) return;
    firebase
      .database()
      .ref("static-data/sssPages")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        dispatch(setArrayData("sssPages", snapshot.val()));
      })
      .catch(error => {});
  };
};

export const updateProfile = () => {
  //  dispatch(setString("profileState","clean")); bunu edit_statelerde kullanacagiz.

  return function(dispatch, getState) {
    var profileKeys = getProfileKeys();
    var err = false;
    for (var i = 0; i < profileKeys.length; i++) {
      if (getState()["new_" + profileKeys[i]].trim() == "") {
        dispatch(setString("editState_" + profileKeys[i], "error"));
        err = true;
      }
      profileInfo;
    }

    if (!err) {
      var profileInfo = {};
      for (var i = 0; i < profileKeys.length; i++) {
        profileInfo[profileKeys[i]] = getState()[
          "new_" + profileKeys[i]
        ].trim();
      }
      dispatch(setString("profileState", "loading"));
      firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid)
        .update(profileInfo)
        .then(function() {
          if (profileInfo["engelDurumu"] === "Engelli Değilim") {
            OneSignal.sendTag("user_engelDurumu", "0");
          } else if (profileInfo["engelDurumu"] === "(Belirtilmemiş)") {
            OneSignal.sendTag("user_engelDurumu", "-1");
          } else {
            OneSignal.sendTag("user_engelDurumu", "1");
          }

          if (
            profileInfo["bisikletHakimiyet"] ===
              "Bisiklet sürmeyi bilmiyorum" ||
            profileInfo["bisikletHakimiyet"] ===
              "Biliyorum ama kendime güvenmiyorum"
          ) {
            OneSignal.sendTag("user_zorluk", "1");
          } else if (
            profileInfo["bisikletHakimiyet"] ===
            "İstanbul içinde rahatlıkla bisiklet kullanabilirim"
          ) {
            OneSignal.sendTag("user_zorluk", "2");
          } else if (
            profileInfo["bisikletHakimiyet"] ===
            "Bisikletle şehirler arası yolculuklar yapıyorum"
          ) {
            OneSignal.sendTag("user_zorluk", "3");
          } else {
            OneSignal.sendTag("user_zorluk", "-1");
          }

          if (
            profileInfo["nereyeGidelim"] === "Şehir içinde kısa/uzun rotalar"
          ) {
            OneSignal.sendTag("user_tur", "1");
          } else if (
            profileInfo["nereyeGidelim"] ===
            "Şehir dışında festival/kamplı turlar"
          ) {
            OneSignal.sendTag("user_tur", "2");
          } else if (
            profileInfo["nereyeGidelim"] ===
            "Yarışlara hazırlanacağım zorlu parkurlar"
          ) {
            OneSignal.sendTag("user_tur", "3");
          } else if (
            profileInfo["nereyeGidelim"] ===
            "Ekspresler... Şehir içinde düzenli olarak yaptığımız turlar. (Tuzla Eksresi, Alibey Köy Ekspresi vb...)"
          ) {
            OneSignal.sendTag("user_tur", "4");
          } else {
            OneSignal.sendTag("user_tur", "-1");
          }

          dispatch(setString("profileState", "clean"));
          dispatch(setString("profileEditState", "normal"));
          for (var i = 0; i < profileKeys.length; i++) {
            dispatch(
              setString(
                "profile_" + profileKeys[i],
                profileInfo[profileKeys[i]]
              )
            );
            dispatch(setString("editState_" + profileKeys[i], "view"));
          }
        });
    }
  };
};

export const selectProfilePictureSource = source => {
  return function(dispatch) {
    if (source == "gallery") {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperToolbarTitle: "Fotoğrafı Düzenle",
        cropperCircleOverlay: true
      }).then(image => {
        var rFilename = firebase.auth().currentUser.uid;
        if (image.mime == "image/jpeg") {
          rFilename += ".jpg";
        } else {
          rFilename += ".png";
        }
        firebase
          .storage()
          .ref("user_profiles/" + rFilename)
          .putFile(image.path)
          .then(file => {
            firebase
              .storage()
              .ref("user_profiles/" + rFilename)
              .getDownloadURL()
              .then(function(url) {
                dispatch(setString("profileImage", url));
              });
            firebase
              .database()
              .ref("users/" + firebase.auth().currentUser.uid)
              .update({ profileImage: "user_profiles/" + file.metadata.name });
          });
      });
    } else {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        cropperToolbarTitle: "Fotoğrafı Düzenle",
        cropperCircleOverlay: true
      }).then(image => {
        var rFilename = firebase.auth().currentUser.uid;
        if (image.mime == "image/jpeg") {
          rFilename += ".jpg";
        } else {
          rFilename += ".png";
        }
        firebase
          .storage()
          .ref("user_profiles/" + rFilename)
          .putFile(image.path)
          .then(file => {
            firebase
              .storage()
              .ref("user_profiles/" + rFilename)
              .getDownloadURL()
              .then(function(url) {
                dispatch(setString("profileImage", url));
              });
            firebase
              .database()
              .ref("users/" + firebase.auth().currentUser.uid)
              .update({ profileImage: "user_profiles/" + file.metadata.name });
          });
      });
    }

    // dispatch(setProfileImage(response.uri))
  };
};

export const queryEvents = filterState => {
  return function(dispatch, getState) {
    var ref = firebase.database().ref("event");

    var startDate = getState().filterStartDate;
    var orderByRaised = false;
    if (startDate != null) {
      var dinfo = startDate.split("-");
      var myDate = new Date(
        Number(dinfo[2]),
        Number(dinfo[1]) - 1,
        Number(dinfo[0])
      );
      var startDateTimestamp = myDate.getTime();
      ref = ref.orderByChild("date").startAt(startDateTimestamp);
      orderByRaised = true;
    } else {
      var startDateTimestamp = Date.now();
      ref = ref.orderByChild("date").startAt(startDateTimestamp);
      orderByRaised = true;
    }

    var endDate = getState().filterEndDate;
    if (endDate != null) {
      var dinfo = endDate.split("-");
      var myDate = new Date(
        Number(dinfo[2]),
        Number(dinfo[1]) - 1,
        Number(dinfo[0]) + 1
      );
      var endDateTimestamp = myDate.getTime();
      if (!orderByRaised) {
        ref = ref.orderByChild("date").endAt(endDateTimestamp);
      } else {
        ref = ref.endAt(endDateTimestamp);
      }
      orderByRaised = true;
    }

    var checkDifficulty = false;
    if (!orderByRaised && filterState.difficulty != 0) {
      ref = ref.orderByChild("difficulty").equalTo(filterState.difficulty);
      orderByRaised = true;
    } else if (orderByRaised && filterState.difficulty != 0) {
      checkDifficulty = true;
    }
    ref = ref
      .once("value")
      .then(snapshot => {
        var result = {};
        snapshot.forEach(function(s) {
          var o = s.val();
          var add = true;
          if (checkDifficulty && o.difficulty != filterState.difficulty) {
            add = false;
          }
          if (getState().filterLocation != null) {
            var eLat = o.origin.latitude;
            var eLng = o.origin.longitude;
            var neLat = getState().filterLocation.northeast.lat;
            var neLng = getState().filterLocation.northeast.lng;
            var swLat = getState().filterLocation.southwest.lat;
            var swLng = getState().filterLocation.southwest.lng;
            if (
              !(
                eLat <= neLat &&
                eLng <= neLng &&
                eLat >= swLat &&
                eLng >= swLng
              )
            ) {
              //if(getDistanceFromLatLonInKm(eLat,eLng,sLat,sLng) > 5){
              add = false;
            }
          }
          if (add) {
            result[s.key] = o;
          }
        });
        dispatch(setArrayData("events", result));
        dispatch(sortArrayByField("events", "date"));
        if (result.length == 0) {
          dispatch(setString("resultText", "Sonuç bulunamadı"));
          dispatch(setString("filterPanelOpen", true));
        } else {
          dispatch(setString("resultText", ""));
          dispatch(setString("filterPanelOpen", false));
        }
      })
      .catch(error => {});
  };
};

export const fetchTeknikPoints = () => {
  return function(dispatch) {
    var ref = firebase
      .database()
      .ref("static-data/teknik-servis")
      .once("value")
      .then(function(snapshot) {
        dispatch(setArrayData("teknikPoints", snapshot.val()));
      });
  };
};

export const remindMe = eventId => {
  return function(dispatch) {
    firebase
      .database()
      .ref("event/" + eventId)
      .once("value")
      .then(function(s) {
        var finalId = s.val().date + "_" + eventId;
        firebase
          .database()
          .ref("users/" + firebase.auth().currentUser.uid + "/remind_me")
          .orderByValue()
          .equalTo(finalId)
          .once("value")
          .then(function(snapshot) {
            if (snapshot.val()) {
              for (var k in snapshot.val()) {
                firebase
                  .database()
                  .ref(
                    "users/" +
                      firebase.auth().currentUser.uid +
                      "/remind_me/" +
                      k
                  )
                  .remove()
                  .then(function() {
                    dispatch(removeValue("remindMe", String(eventId)));
                  });
                break;
              }
            } else {
              firebase
                .database()
                .ref("users/" + firebase.auth().currentUser.uid + "/remind_me")
                .push(finalId)
                .then(function() {
                  dispatch(push("remindMe", String(eventId)));
                });
            }
          });
      });
  };
};

export const fillSeatInfo = seatIndex => {
  return function(dispatch, getState) {
    if (getState().event.seats[seatIndex].on) {
      firebase
        .database()
        .ref("users/" + getState().event.seats[seatIndex].on)
        .once("value")
        .then(function(snapshot) {
          firebase
            .storage()
            .ref(snapshot.val().profileImage)
            .getDownloadURL()
            .then(function(url) {
              dispatch(
                setKeyValue("seatInfo", seatIndex + "_front_photo", url)
              );
            });
        });
    }
    if (getState().event.seats[seatIndex].arka) {
      firebase
        .database()
        .ref("users/" + getState().event.seats[seatIndex].arka)
        .once("value")
        .then(function(snapshot) {
          firebase
            .storage()
            .ref(snapshot.val().profileImage)
            .getDownloadURL()
            .then(function(url) {
              dispatch(setKeyValue("seatInfo", seatIndex + "_back_photo", url));
            });
        });
    }
  };
};

export const getFriendProfile = friendUid => {
  return function(dispatch) {
    firebase
      .database()
      .ref("users/" + friendUid)
      .once("value")
      .then(function(snapshot) {
        dispatch(setString("friendProfileName", snapshot.val().name));
        dispatch(setString("friendProfileId", friendUid));
        firebase
          .storage()
          .ref(snapshot.val().profileImage)
          .getDownloadURL()
          .then(function(url) {
            dispatch(setString("friendProfileImage", url));
          });
      });
  };
};

export const clearSeatSelection = () => {
  return function(dispatch) {
    dispatch(setString("selectedSeat", null));
    dispatch(setString("seatInfo", {}));
    dispatch(setString("eventPage", 0));
  };
};

export const saveSeatSelection = () => {
  return function(dispatch, getState) {
    if (getState().selectedSeat == null) return;
    var selectedSeat = getState().selectedSeat.split("_");
    var seatPlace = selectedSeat[0] == "front" ? "on" : "arka";
    var updateObject = {};
    updateObject[seatPlace] = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref("event/" + getState().event.key + "/seats/" + selectedSeat[1])
      .update(updateObject)
      .then(function() {
        firebase
          .database()
          .ref("event/" + getState().event.key)
          .once("value")
          .then(function(snapshot) {
            var o = snapshot.val();
            var remain = calcRemainSeats(o);

            firebase
              .database()
              .ref("event/" + getState().event.key)
              .update({ kalanKontenjan: remain })
              .then(function() {
                firebase
                  .database()
                  .ref("event/" + getState().event.key)
                  .once("value")
                  .then(function(snapshot) {
                    firebase
                      .database()
                      .ref(
                        "users/" +
                          firebase.auth().currentUser.uid +
                          "/particips"
                      )
                      .push(getState().event.date + "_" + getState().event.key)
                      .then(function() {
                        var event = snapshot.val();
                        event.key = getState().event.key;
                        dispatch(
                          setArrayElement("events", getState().event.key, event)
                        );
                        dispatch(setItem("event", getState().event.key));
                        dispatch(clearSeatSelection());
                      });
                  });
              });
          });
      });
  };
};

export const cancelSeat = () => {
  return function(dispatch, getState) {
    dispatch(setString("friendProfileImage", null));
    dispatch(setString("friendProfileName", null));
    dispatch(setString("friendProfileId", null));
    var uid = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref("event/" + getState().event.key + "/seats")
      .orderByChild("on")
      .equalTo(uid)
      .once("value")
      .then(function(snapshot) {
        if (snapshot.exists()) {
          var key;
          for (var k in snapshot.val()) {
            if (snapshot.val()[k] != null) {
              key = snapshot.val()[k].key;
              break;
            }
          }
          firebase
            .database()
            .ref("event/" + getState().event.key + "/seats/" + key)
            .update({ on: null })
            .then(function() {
              firebase
                .database()
                .ref("event/" + getState().event.key)
                .once("value")
                .then(function(snapshot) {
                  var o = snapshot.val();
                  var remain = calcRemainSeats(o);

                  firebase
                    .database()
                    .ref("event/" + getState().event.key)
                    .update({ kalanKontenjan: remain })
                    .then(function() {
                      firebase
                        .database()
                        .ref("event/" + getState().event.key)
                        .once("value")
                        .then(function(snapshot) {
                          firebase
                            .database()
                            .ref(
                              "users/" +
                                firebase.auth().currentUser.uid +
                                "/particips"
                            )
                            .orderByValue()
                            .equalTo(
                              getState().event.date + "_" + getState().event.key
                            )
                            .remove()
                            .then(function() {
                              var event = snapshot.val();
                              event.key = getState().event.key;
                              dispatch(
                                setArrayElement(
                                  "events",
                                  getState().event.key,
                                  event
                                )
                              );
                              dispatch(setItem("event", getState().event.key));
                            });
                        });
                    });
                });
            });
        }
      });
    firebase
      .database()
      .ref("event/" + getState().event.key + "/seats")
      .orderByChild("arka")
      .equalTo(uid)
      .once("value")
      .then(function(snapshot) {
        if (snapshot.exists()) {
          var key;
          for (var k in snapshot.val()) {
            if (snapshot.val()[k] != null) {
              key = snapshot.val()[k].key;
              break;
            }
          }
          firebase
            .database()
            .ref("event/" + getState().event.key + "/seats/" + key)
            .update({ arka: null })
            .then(function() {
              firebase
                .database()
                .ref("event/" + getState().event.key)
                .once("value")
                .then(function(snapshot) {
                  var event = snapshot.val();
                  event.key = getState().event.key;
                  dispatch(
                    setArrayElement("events", getState().event.key, event)
                  );
                  dispatch(setItem("event", getState().event.key));
                });
            });
        }
      });
  };
};

export const profilePage = (profileId, source) => {
  return function(dispatch) {
    firebase
      .database()
      .ref("users/" + profileId)
      .once("value")
      .then(function(snapshot) {
        var obj = snapshot.val();
        if (obj.profileImage) {
          firebase
            .storage()
            .ref(obj.profileImage)
            .getDownloadURL()
            .then(function(url) {
              obj.profileImage = url;
              dispatch(setString("viewingProfileSource", source));
              dispatch(setString("viewingProfile", obj));
              dispatch(setString("eventPage", 3));
            });
        } else {
          dispatch(setString("viewingProfileSource", source));
          dispatch(setString("viewingProfile", obj));
          dispatch(setString("eventPage", 3));
        }
      });
  };
};

export const closeProfile = () => {
  return function(dispatch, getState) {
    dispatch(setString("eventPage", getState().viewingProfileSource));
    dispatch(setString("viewingProfileSource", null));
    dispatch(setString("viewingProfile", null));
  };
};

export const fetchMyEvents = () => {
  return function(dispatch, getState) {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/particips")
      .once("value")
      .then(function(snapshot1) {
        var arr = snapshot1.val();
        var particips = [];
        for (var k in arr) {
          var info = arr[k].split("_");
          if (Number(info[0]) >= Date.now()) {
            particips.push(info[1]);
          }
        }
        dispatch(setKeyValue("myEvents", "particips", particips));
      });

    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/remind_me")
      .once("value")
      .then(function(snapshot1) {
        var arr = snapshot1.val();
        var particips = [];
        for (var k in arr) {
          var info = arr[k].split("_");
          if (Number(info[0]) >= Date.now()) {
            particips.push(info[1]);
          }
        }
        dispatch(setKeyValue("myEvents", "reminders", particips));
      });

    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/particips")
      .once("value")
      .then(function(snapshot1) {
        var arr = snapshot1.val();
        var particips = [];
        for (var k in arr) {
          var info = arr[k].split("_");
          if (Number(info[0]) < Date.now()) {
            particips.push(info[1]);
          }
        }
        dispatch(setKeyValue("myEvents", "history", particips));
      });
  };
};

export const facebookLogin = () => {
  return function(dispatch) {
    LoginManager.logInWithReadPermissions(["public_profile", "email"])
      .then(result => {
        if (result.isCancelled) {
          return Promise.reject(new Error("The user cancelled the request"));
        }
        // Retrieve the access token
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        console.log("DATA", data);
        // Create a new Firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken
        );
        // Login with the credential
        return firebase.auth().signInWithCredential(credential);
      })
      .then(user => {
        var uid = user.user.uid;
        firebase
          .database()
          .ref("users/" + uid)
          .once("value")
          .then(function(snap) {
            if (snap.exists()) {
              OneSignal.sendTag("user_id", uid);
              dispatch(navigate(SCREEN_MAIN));
              dispatch(setString("navigationStack", []));
            } else {
              firebase
                .database()
                .ref("users/" + uid)
                .update({
                  name: user.additionalUserInfo.profile.name,
                  emailValidationCode: "-1",
                  profileAgreed: false,
                  userAgreed: false
                })
                .then(function() {
                  OneSignal.sendTag("user_id", uid);
                  dispatch(navigate(SCREEN_MAIN));
                  dispatch(setString("navigationStack", []));
                });
            }
          });
      })
      .catch(error => {
        const { code, message } = error;
        console.log(error);
        console.log("FBLogin Error", code, message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  };
};
