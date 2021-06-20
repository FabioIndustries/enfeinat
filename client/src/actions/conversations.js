import * as api from "../api";
import { getMessages } from "./messages";

export const getConversations = () => async (dispatch) => {
  try {
    const { data } = await api.fetchConversations();
    dispatch({ type: "CONVERSATIONS_FETCH_ALL", payload: data });
    const conversationsIds = data.map((conversation) => {
      return conversation._id;
    });
    dispatch(getMessages(conversationsIds));
  } catch (error) {
    console.error(error);
  }
};

export const createConversation = (conversation) => async (dispatch) => {
  try {
    const { data } = await api.createConversation(conversation);
    dispatch({ type: "CONVERSATIONS_CREATE", payload: data });
    return data;
  } catch (error) {
    console.error(error);
  }
};
