import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import appReducer from "./app/reducer";
import {I_appActions} from "./app/actions";
import formsReducer from "./forms/reducer";
import {I_formsActions} from "./forms/actions";

const rootReducer = combineReducers({
  app: appReducer,
  forms: formsReducer
});

export type AppStateType = ReturnType<typeof rootReducer>;
export type AppActionsType = I_appActions | I_formsActions;

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type GetStateType = () => AppStateType

export default store;