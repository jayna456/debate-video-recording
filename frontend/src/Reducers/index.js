import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import headerReducer from "./headerReducer";
import debateReducer from "./debateReducer";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  header: headerReducer,
  debate: debateReducer,
});
