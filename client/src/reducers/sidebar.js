const sidebarReducer = (state = 'responsive', action)  => {
  switch (action.type) {
    case 'SIDEBAR_SET':
      return action.payload;
    default:
      return state;
  }
};

export default sidebarReducer;
