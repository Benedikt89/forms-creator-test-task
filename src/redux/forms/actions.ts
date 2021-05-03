import {ThunkDispatch} from "redux-thunk";
import {AppActionsType, GetStateType} from "../store";
import {formsAPI} from "./api";
import {fetchHandler} from "../fetchHandler";
import {DataPayloadType, DataType, FieldItem, FormItemType} from "../../types/form-types";
import {selectUserData} from "../app/selectors";
import {newFormTemplate} from "./reducer";
import {selectForm} from "./selectors";

export const formsActionTypes: {
  SET_FETCHED_DATA: "forms/SET_FETCHED_DATA",
  UPDATE_ITEM_SUCCESS: "forms/UPDATE_ITEM_SUCCESS",
  ADD_NEW_FORM: "forms/ADD_NEW_FORM",
  ADD_NEW_FORM_FIELD: "forms/ADD_NEW_FORM_FIELD",
  SET_EDITING_FIELD: "forms/SET_EDITING_FIELD",
  UPDATE_FIELD: "forms/UPDATE_FIELD",
  UPDATE_FORM: "forms/UPDATE_FORM",
  DELETE_FIELD: "forms/DELETE_FIELD",
  DELETE_FORM: "forms/DELETE_FORM",
} = {
  SET_FETCHED_DATA: "forms/SET_FETCHED_DATA",
  UPDATE_ITEM_SUCCESS: "forms/UPDATE_ITEM_SUCCESS",
  ADD_NEW_FORM: "forms/ADD_NEW_FORM",
  ADD_NEW_FORM_FIELD: "forms/ADD_NEW_FORM_FIELD",
  SET_EDITING_FIELD: "forms/SET_EDITING_FIELD",
  UPDATE_FIELD: "forms/UPDATE_FIELD",
  UPDATE_FORM: "forms/UPDATE_FORM",
  DELETE_FIELD: "forms/DELETE_FIELD",
  DELETE_FORM: "forms/DELETE_FORM",
};

export type I_formsActions = I_setFetchedData | I_updateItemSuccess | I_addNewForm | I_addNewFormField |
  I_setEditingField | I_deleteField | I_updateField | I_deleteForm

//interfaces
interface I_setFetchedData {
  type: typeof formsActionTypes.SET_FETCHED_DATA,
  data: Array<DataPayloadType>
  dataType: DataType
}
interface I_updateItemSuccess {
  type: typeof formsActionTypes.UPDATE_ITEM_SUCCESS,
  data: DataPayloadType
  dataType: DataType
}
interface I_addNewForm {
  type: typeof formsActionTypes.ADD_NEW_FORM, form: FormItemType
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
interface I_deleteForm {
  type: typeof formsActionTypes.DELETE_FORM, formId: string
}
interface I_updateField {
  type: typeof formsActionTypes.UPDATE_FIELD, fieldId: string, formId: string, field: Partial<FieldItem>
}

//Internal ACTIONS CREATORS

export const _updateItemSuccess = (data: DataPayloadType, dataType: DataType): I_updateItemSuccess =>
  ({type: formsActionTypes.UPDATE_ITEM_SUCCESS, data, dataType});

export const _deleteForm = (formId: string): I_deleteForm => ({
  type: formsActionTypes.DELETE_FORM, formId
});
export const _setFetchedData = (data: DataPayloadType[], dataType: DataType): I_setFetchedData =>
  ({type: formsActionTypes.SET_FETCHED_DATA, data, dataType});

export const _addNewForm = (form: FormItemType): I_addNewForm => ({
  type: formsActionTypes.ADD_NEW_FORM, form
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
export const addNewForm = () =>
  fetchHandler(
    "addNewForm",
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>, getState: GetStateType) => {
      const userData = selectUserData(getState());
      if (userData && userData.id) {
        const res = await formsAPI.addItem({...newFormTemplate, creatorId: userData.id});
        if (res) {
          dispatch(_addNewForm(res));
          return true;
        }
      }
    });

export const fetchFormsData = () =>
  fetchHandler(
    "fetchAllData",
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>) => {
      //array of data to fetch
      const datas: DataType[] = ["user", "forms"];
      //promised function
      let fetch = async (type: DataType) => {
        let res = await formsAPI[type === "forms" ? "getItems" : "getUsers"]();
        if (res) {
          dispatch(_setFetchedData(res, type));
          return true;
        }
      };
      // racing all data
      const success = await Promise.race(datas.map(d => fetch(d)));
      if (success) {
        return true;
      }
  });


export const onFormUpdate = (formId: string) =>
  fetchHandler(
    `form${formId}`,
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>, getState: GetStateType) => {
      let res;
      const form = selectForm(getState(), formId);
      //user data to set who was updating last
      let userData = selectUserData(getState());
      if (userData && userData.id && form) {
        res = await formsAPI.updateItem(form);
        //after response set data to reducer
        if (res) {
          dispatch(_updateItemSuccess(res, "forms"));
          return true;
        }
      }
    });

export const deleteForm = (formId: string) => fetchHandler(
  `form${formId}`,
  async (dispatch: ThunkDispatch<{}, {}, AppActionsType>, getState: GetStateType) => {
    let res;
    const form = selectForm(getState(), formId);
    //user data to set who was updating last
    let userData = selectUserData(getState());
    if (userData && userData.id && form) {
      res = await formsAPI.deleteItem(formId);
      //after response set data to reducer
      if (res) {
        dispatch(_deleteForm(formId));
        return true;
      }
    }
  });
