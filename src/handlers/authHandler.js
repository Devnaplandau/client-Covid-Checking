import authApi from "../api/authApi";
import partnerApi from "../api/partnerApi";
export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    await authApi.checkToken();
    return true;
  } catch (err) {
    return false;
  }
};
export const isAuthenticatedPartner = async () => {
  const token = localStorage.getItem("tokenPartner");
  if (!token) return false;
  try {
    await partnerApi.checkToken();
    return true;
  } catch (err) {
    return false;
  }
};

export const logout = (navigator) => {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
    navigator("/login/admin");
  } else if (localStorage.getItem("tokenPartner")) {
    localStorage.removeItem("tokenPartner");
    localStorage.removeItem("namePartner");
    localStorage.removeItem("idPartner");
    navigator("/login/partner");
  }
};
