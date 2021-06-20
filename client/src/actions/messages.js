import * as api from "../api";

export const getMessages = (conversationsList) => async (dispatch) => {
  try {
    const { data } = await api.fetchMessages(conversationsList);
    dispatch({ type: "MESSAGES_FETCH_ALL", payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const createMessage = (message) => async (dispatch) => {
  try {
    const { data } = await api.createMessage(message);
    dispatch({ type: "MESSAGES_CREATE", payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const markMessageAsRead = (messageList) => async (dispatch) => {
  try {
    const { data } = await api.markMessageAsRead(messageList);
    dispatch({ type: "MESSAGES_MARK_READ", payload: { messageList, data } });
  } catch (error) {
    console.error(error);
  }
};