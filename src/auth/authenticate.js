export default (to, from, next) => {
      next()
  if (
    localStorage.getItem("token")
    // localStorage.getItem("userInfo") != null &&
    // localStorage.getItem("userInfo").length > 0
  ) {
    next();
  } else {
    localStorage.removeItem("userInfo");
    next("/auth/login");
  }
};
