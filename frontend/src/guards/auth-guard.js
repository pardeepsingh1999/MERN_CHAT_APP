import { getToken } from "../http/token-interceptor";

export const isUserAuthenticated = async () => {
  const authToken = await getToken();

  return authToken ? authToken : null;
};
