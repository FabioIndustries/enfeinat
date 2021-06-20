const alertsReducer = (alerts = '', action) => {
  switch (action.type) {
    case "SHOW_MESSAGE_ALERT":
      return action.payload;
    default:
      return alerts;
  }
};

export default alertsReducer;
