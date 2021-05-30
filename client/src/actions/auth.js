import * as api from "../api/index.js";
import { getNumbers } from "./general.js";

export const login = (formData) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);
    dispatch({ type: "LOGIN", data });
    return { success: true };
  } catch (error) {
    if (error.response.status !== 200) {
      const data = error.response.data;
      return { success: false, error_code: data.error_code };
    }
    console.error(error);
  }
};

export const signup = (formData) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: "SIGNUP", data });
    dispatch(getNumbers());
    return { success: true };
  } catch (error) {
    if (error.response.status !== 200) {
      const data = error.response.data;
      return { success: false, error_code: data.error_code };
    }
    console.error(error);
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error(error);
  }
};

export const initUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "INIT_USER",
      data: JSON.parse(localStorage.getItem("profile")),
    });
  } catch (error) {
    console.error(error);
  }
};
