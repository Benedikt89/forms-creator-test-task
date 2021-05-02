import {AppStateType} from "../store";
import {I_UserData} from "../../types/app-types";

export const selectFetchingByKey = (state: AppStateType, key: string): boolean =>
  !!state.app.isFetching[key];

export const selectErrorByKey = (state: AppStateType, key: string): null | { message: string } =>
  state.app.error[key] ? state.app.error[key] : null;

export const selectIsAuth = (state: AppStateType): boolean =>
  !!state.app.userData;

export const selectUserData = (state: AppStateType): I_UserData | null =>
  state.app.userData;
