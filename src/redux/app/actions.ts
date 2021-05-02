import {ThunkDispatch} from "redux-thunk";
import {AppActionsType} from "../store";
import {LanguageType} from "../../constants/languageType";
import {fetchHandler} from "../fetchHandler";
import {I_LoginData, I_UserData} from "../../types/app-types";
import {appAPI} from "./appAPI";

export const appActionTypes: {
  SET_IS_FETCHING: 'app/SET_IS_FETCHING'
  SET_ERROR: 'app/SET_ERROR'
  SET_LANGUAGE: 'app/SET_LANGUAGE'
  SET_USER_DATA: 'app/SET_USER_DATA'
} = {
  SET_IS_FETCHING: 'app/SET_IS_FETCHING',
  SET_ERROR: 'app/SET_ERROR',
  SET_LANGUAGE: 'app/SET_LANGUAGE',
  SET_USER_DATA: 'app/SET_USER_DATA'
};

export type I_appActions = I_setFetching | I_setError | I_setLanguage | I_setUserData

//interfaces
interface I_setFetching {
  type: typeof appActionTypes.SET_IS_FETCHING,
  key: string
  status: boolean
}
interface I_setError {
  type: typeof appActionTypes.SET_ERROR,
  key: string
  message: null | string
}
interface I_setLanguage {
  type: typeof appActionTypes.SET_LANGUAGE,
  key: LanguageType
}
interface I_setUserData {
  type: typeof appActionTypes.SET_USER_DATA,
  data: null | I_UserData
}


//Internal ACTIONS CREATORS
export const _setFetching = (key: string, status: boolean): I_setFetching =>
  ({type: appActionTypes.SET_IS_FETCHING, key, status});

export const _setError = (key: string, message: string | null): I_setError =>
  ({type: appActionTypes.SET_ERROR, key, message});

export const setUserData = (data: I_UserData | null): I_setUserData =>
  ({type: appActionTypes.SET_USER_DATA, data});

export const setLanguage = (key: LanguageType): I_setLanguage =>
  ({type: appActionTypes.SET_LANGUAGE, key});


/* ====================
  thunk actions
 ==================== */

export const logInThunk = (data: I_LoginData) => fetchHandler(
  'logInThunk',
  async (dispatch: ThunkDispatch<{}, {}, AppActionsType>) => {
    const res = await appAPI.logIn(data);
    if (res) {
      dispatch(setUserData(res));
      return true;
    }
  });

export const onUserRegister = (user: I_UserData) => fetchHandler(
  'onUserRegister',
  async (dispatch: ThunkDispatch<{}, {}, AppActionsType>) => {
    const res = await appAPI.register(user);
    if (res) {
      dispatch(setUserData(res));
      return true;
    }
  });
