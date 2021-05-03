import {ThunkDispatch} from "redux-thunk";
import {AppActionsType} from "../store";
import {DataPayloadType, DataType} from "../../types/ticket-types";
import {ticketsAPI} from "./api";
import {fetchHandler} from "../fetchHandler";
import {FieldItem} from "../../types/form-types";

export const formsActionTypes: {
  SET_FETCHED_FORMS: "forms/SET_FETCHED_FORMS",
  UPDATE_ITEM_SUCCESS: "forms/UPDATE_ITEM_SUCCESS",
  ADD_NEW_FORM: "forms/ADD_NEW_FORM",
  ADD_NEW_FORM_FIELD: "forms/ADD_NEW_FORM_FIELD",
  SET_EDITING_FIELD: "forms/SET_EDITING_FIELD",
  UPDATE_FIELD: "forms/UPDATE_FIELD",
  UPDATE_FORM: "forms/UPDATE_FORM",
  DELETE_FIELD: "forms/DELETE_FIELD",
} = {
  SET_FETCHED_FORMS: "forms/SET_FETCHED_FORMS",
  UPDATE_ITEM_SUCCESS: "forms/UPDATE_ITEM_SUCCESS",
  ADD_NEW_FORM: "forms/ADD_NEW_FORM",
  ADD_NEW_FORM_FIELD: "forms/ADD_NEW_FORM_FIELD",
  SET_EDITING_FIELD: "forms/SET_EDITING_FIELD",
  DELETE_FIELD: "forms/DELETE_FIELD",
  UPDATE_FIELD: "forms/UPDATE_FIELD",
  UPDATE_FORM: "forms/UPDATE_FORM",
};

export type I_formsActions = I_setFetchedData | I_updateItemSuccess | I_addNewForm | I_addNewFormField |
  I_setEditingField | I_deleteField | I_updateField

//interfaces
interface I_setFetchedData {
  type: typeof formsActionTypes.SET_FETCHED_FORMS,
  data: Array<DataPayloadType>
  dataType: DataType
}
interface I_updateItemSuccess {
  type: typeof formsActionTypes.UPDATE_ITEM_SUCCESS,
  data: DataPayloadType
  dataType: DataType
}
interface I_addNewForm {
  type: typeof formsActionTypes.ADD_NEW_FORM,
}
interface I_addNewFormField {
  type: typeof formsActionTypes.ADD_NEW_FORM_FIELD, formId: string, index: number
}
interface I_setEditingField {
  type: typeof formsActionTypes.SET_EDITING_FIELD, fieldId: string
}
interface I_deleteField {
  type: typeof formsActionTypes.DELETE_FIELD
}
interface I_updateField {
  type: typeof formsActionTypes.UPDATE_FIELD, fieldId: string, formId: string, field: Partial<FieldItem>
}

//Internal ACTIONS CREATORS

export const _updateItemSuccess = (data: DataPayloadType, dataType: DataType): I_updateItemSuccess =>
  ({type: formsActionTypes.UPDATE_ITEM_SUCCESS, data, dataType});

export const _setFetchedData = (data: DataPayloadType[], dataType: DataType): I_setFetchedData =>
  ({type: formsActionTypes.SET_FETCHED_FORMS, data, dataType});

export const addNewForm = () => ({
  type: formsActionTypes.ADD_NEW_FORM
});
export const addNewFormField = (formId: string, index: number): I_addNewFormField => ({
  type: formsActionTypes.ADD_NEW_FORM_FIELD, formId, index
});
export const setEditingField = (fieldId: string): I_setEditingField => ({
  type: formsActionTypes.SET_EDITING_FIELD, fieldId
});
export const deleteField = (): I_deleteField => ({
  type: formsActionTypes.DELETE_FIELD
});
export const updateField = (formId: string, fieldId: string, field: Partial<FieldItem>): I_updateField => ({
  type: formsActionTypes.UPDATE_FIELD, field, fieldId, formId
});

/* ====================
  thunk actions
 ==================== */

export const fetchForms = () =>
  fetchHandler(
    "fetchAllData",
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>) => {
      //array of data to fetch
      const datas: DataType[] = ["ticket", "list", "user"];
      //promiced function
      let fetch = async (type: DataType) => {
        let res = await ticketsAPI[
          type === "ticket" ? "getTickets"
          : type === "list" ? "getLists" : "getUsers"]();
        if (res) {
          return true;
        }
      };
      // racing all data
      const success = await Promise.race(datas.map(d => fetch(d)));
      if (success) {
        return true;
      }
  });

