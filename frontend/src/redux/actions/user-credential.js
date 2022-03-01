import { getLoggedInUserDetail } from "../../http/http-calls";
import {
  ADD_USER_CREDENTIAL,
  UPDATE_USER_DATA,
  CLEAR_USER_CREDENTIAL,
} from "./action-types";

export const addUserCredential = (credential) => {
  return {
    type: ADD_USER_CREDENTIAL,
    payload: {
      credential,
    },
  };
};

export const updateUserData = (user) => {
  return {
    type: UPDATE_USER_DATA,
    payload: {
      user,
    },
  };
};

export const clearUserCredential = () => {
  return {
    type: CLEAR_USER_CREDENTIAL,
  };
};

export const getAndUpdateUserData = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      getLoggedInUserDetail()
        .then((res) => {
          dispatch(updateUserData(res.user));
          resolve(res);
        })
        .catch((error) => {
          console.log("error>>", error);
          reject(error);
        });
    });
  };
};
