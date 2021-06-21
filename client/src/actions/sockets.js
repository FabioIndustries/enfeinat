import socketClient from "socket.io-client";
import dotenv from "dotenv";
import { getMessages } from "./messages";
import { showNewMessageAlert } from "./alerts";
import { getConversations } from "./conversations";

dotenv.config();
const socket = socketClient(process.env.REACT_APP_API_URL);

export const connectSocket = () => async (dispatch) => {

  if (socket.connected) return;

  socket.on("connect", () => {

    socket.on("message", (data) => {
      //console.log(data);
    });

    socket.on("new-message", (data) => {
      //console.log("Received new message!");
      //console.log(data);
      dispatch(showNewMessageAlert(""));
      dispatch(showNewMessageAlert("New message!"));
      dispatch(getMessages([data.conversationId]));
      dispatch(getConversations());
    });
  });
};

export const sendSocketMessage =
  ({ userId, conversationId }) =>
  async (dispatch) => {
    if (!socket.connected) return;
    //console.log("Trying to send socketMessage");
    socket.emit("new-message", { userId, conversationId });
  };

export const registerAuthedUser = (auth) => async (dispatch) => {
  if (auth) {
    socket.emit("logged-user", { userId: auth.result._id });
  }
};
