import {AppStateType} from "../store";
import {FormItemType} from "../../types/form-types";

export const selectForm = (state: AppStateType, id: string): FormItemType | null => {
  if (state.forms.forms[id]) {
    return state.forms.forms[id];
  }
  return null;
};
