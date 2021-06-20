const messagesReducer = (messages = [], action) => {
  switch (action.type) {
    case "MESSAGES_FETCH_ALL":
      return action.payload;
    case "MESSAGES_CREATE":
      return [...messages, action.payload];
    case "MESSAGES_MARK_READ":
      return [...messages].map((message) => { if (action.payload.messageList.includes(message._id)) { message.isRead = true; } return message;})
    default:
      return messages;
  }
};

export default messagesReducer;
