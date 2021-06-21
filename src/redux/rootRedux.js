import {combineReducers} from "redux";
import {postRedux} from "./postRedux";

export const rootRedux = combineReducers({
    store: postRedux
});