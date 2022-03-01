import { store } from "../redux/store";

export const isUserAuthenticated = () => {
  const state = store.getState();

  if (state?.userCredential?.token) return true;

  return false;
};
