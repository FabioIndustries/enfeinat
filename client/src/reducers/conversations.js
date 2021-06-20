const conversationsReducer = (conversations = [], action) => {
  switch (action.type) {
    case "CONVERSATIONS_FETCH_ALL":
      return action.payload;
    case "CONVERSATIONS_CREATE":
      return [...conversations, action.payload];
    default:
      return conversations;
  }
};

export default conversationsReducer;
