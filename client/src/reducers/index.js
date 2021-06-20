import { combineReducers } from "redux";

import general from "./general";
import auth from "./auth";
import offers from "./offers";
import candidates from "./candidates";
import conversations from "./conversations";
import messages from "./messages";
import sidebarShow from "./sidebar";
import alerts from "./alerts";

export default combineReducers({
  general,
  auth,
  offers,
  candidates,
  conversations,
  messages,
  sidebarShow,
  alerts,
});
