import {
  ADD_USER_CREDENTIAL,
  UPDATE_USER_DATA,
  CLEAR_USER_CREDENTIAL,
} from "../actions";

const initialState = {
  token: null,
  user: null,
};

export const userCredentialReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case ADD_USER_CREDENTIAL: {
      newState = action.payload.credential;
      break;
    }
    case UPDATE_USER_DATA: {
      newState["user"] = action.payload.user;
      break;
    }
    case CLEAR_USER_CREDENTIAL: {
      newState = initialState;
      break;
    }
    default:
  }
  return newState;
};
