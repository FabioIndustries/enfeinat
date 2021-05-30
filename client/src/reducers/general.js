const generalReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_GENERAL_NUMBERS":
      return action.payload;
    default:
      return state;
  }
};

export default generalReducer;
