export const getToken = () => {
  return new Promise((resolve) => {
    const token = localStorage.getItem("userData");

    if (token) {
      resolve(token);
      return;
    }

    resolve(null);
  });
};
