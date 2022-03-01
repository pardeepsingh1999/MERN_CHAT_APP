import { SHOW_LOADER, HIDE_LOADER } from "../actions";

const initialState = { isVisible: false, loaderText: "Loading" };

export const loaderDataReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SHOW_LOADER: {
      newState = {
        isVisible: true,
        loaderText: action.payload.loaderText,
      };
      break;
    }
    case HIDE_LOADER: {
      newState = initialState;
      break;
    }
    default: {
    }
  }
  return newState;
};
