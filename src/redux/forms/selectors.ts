import {AppStateType} from "../store";
import {FormItemType} from "../../types/form-types";

export const selectForm = (state: AppStateType, id: string): FormItemType | null => {
  if (state.forms.forms[id]) {
    return state.forms.forms[id];
  }
  return null;
};

export const selectIsFormOwner = (state: AppStateType, id: string): boolean | null => {
  if (state.forms.forms[id]) {
    if (state.app.userData) {
      return state.forms.forms[id].creatorId === state.app.userData.id;
    }
  }
  return null;
};