import { axiosLoginInstance } from "../../axiosInstance";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../constant/UserCostants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });
    const { data } = await axiosLoginInstance.post("/jwt/create/", {
      email: email,
      password: password,
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    sessionStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.log("Errr:", error);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  sessionStorage.clear();
  dispatch({
    type: USER_LOGOUT,
  });
};
