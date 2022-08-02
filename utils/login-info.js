export let loginInfo = null;

export const setLoginInfo = (email) => {
  loginInfo = {
    email,
  };
};

export const clearLoginInfo = () => {
  loginInfo =  null
};
