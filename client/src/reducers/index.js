import { combineReducers } from "redux";

import general from "./general";
import auth from "./auth";
import offers from "./offers";
import candidates from "./candidates";
import sidebarShow from "./sidebar";

export default combineReducers({
  general,
  auth,
  offers,
  candidates,
  sidebarShow,
});
