import {combineReducers} from 'redux'
import socket from "./socket";
import user from "./user";

export default combineReducers({
  socket,
  user
})
