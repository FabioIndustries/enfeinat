export const showNewMessageAlert = (alertText) => async (dispatch) => {
  try {
    dispatch({ type: "SHOW_MESSAGE_ALERT", payload: alertText });
  } catch (error) {
    console.error(error);
  }
};