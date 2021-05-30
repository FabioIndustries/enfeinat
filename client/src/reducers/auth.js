const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'SIGNUP':
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return action.data;
    case 'INIT_USER':
      return action.data;
    case 'LOGOUT':
      localStorage.clear();
      return null;
    default:
      return state;
  }
};

export default authReducer;