import {AppStateType} from "../store";
import {FormItemType, I_User} from "../../types/form-types";
import {isUser} from "../../types/typeHelpers";

export const selectForm = (state: AppStateType, id: string): FormItemType | null => {
  if (state.forms.forms[id]) {
    return state.forms.forms[id];
  }
  return null;
};

export const selectUser = (state: AppStateType, userId: string): I_User | null =>
  isUser(state.forms.user[userId]);
