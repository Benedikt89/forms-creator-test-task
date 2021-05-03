import {AppActionsType} from "../store";
import moment from "moment";
import {
  DataPayloadType,
  FieldItem,
  FieldTypes,
  FormItemType,
  I_dataState,
  I_User,
  RuleItem,
  RulesTypes
} from "../../types/form-types";
import {formsActionTypes} from "./actions";
import {v4 as uuid} from 'uuid';
import {isForm, isUser} from "../../types/typeHelpers";

export const newFormId = '_NEW_FORM';

export const ruleTypes: RulesTypes[] = ['min', 'max'];
export const ruleUniqTypes: RulesTypes[] = ['phone', 'email', 'number'];

export const getRule = (type: RulesTypes, ruleVal: number = 5) => {
  const response: RuleItem = {type, apply: [], ruleVal, callBack: (value: string | boolean | number) => !value ? 'Field is required!' : undefined};
  switch (type) {
    case "email": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value !== 'string') return 'Error should be string!';
        const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regExp.test(String(value).toLowerCase())) {
          return 'Should be valid e-mail!'
        }
      };
      break
    }
    case "phone": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value !== 'string') return 'Error should be string!';
        const regExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/i;
        if (!regExp.test(String(value).toLowerCase())) {
          return 'Should be valid phone!'
        }
      };
      break
    }
    case "min": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value === 'string' && value.length >= ruleVal) {
          return undefined
        }
        if (typeof value === 'number' && value >= ruleVal) {
          return undefined;
        }
        return 'Should be more then ' + ruleVal + '!'
      };
      break;
    }
    case "max": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value === 'string' && value.length < ruleVal) {
          return undefined
        }
        if (typeof value === 'number' && value < ruleVal) {
          return undefined;
        }
        return 'Should be less then ' + ruleVal + '!'
      };
      break;
    }
    case "number": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof +value === 'number' && !Number.isNaN(+value)) {
          return undefined;
        }
        return 'Should be number!'
      };
      break;
    }
  }
  return response;
};

const initialDefaultField = {
  defaultValue: '',
  values: {},
  title: 'Question',
  description: 'description',
  displayDescription: false,
  mandatory: false,
  minRange: 0,
  maxRange: 100,
  rules: [],
  options: [{value: uuid(), title: 'Option'}]
};

export const getNewField = (inputType: FieldTypes = 'text'): FieldItem => ({
  ...initialDefaultField,
  id: uuid(),
  inputType,
});

export const newFormTemplate: FormItemType = {
  id: newFormId,
  creatorId: '',
  title: 'Person',
  description: '',
  lastUpdated: moment(),
  confirmed: false,
  fields: {
    'name': {
      ...initialDefaultField,
      id: 'name',
      title: 'name',
      inputType: 'text',
    },
    'email': {
      ...initialDefaultField,
      id: 'email',
      inputType: 'text',
      title: 'email',
    },
    'gender': {
      ...initialDefaultField,
      id: 'gender',
      title: 'gender',
      inputType: 'radio',
      options: [{value: uuid(), title: 'Male'}, {value: uuid(), title: 'Female'}]
    }
  },
  fieldsIds: ['name', 'email', 'gender']
};

const initialState:I_dataState = {
  forms: {},
  user: {},
  editingFormId: 'person',
  editingFieldId: ''
};

const formsReducer = (state: I_dataState = initialState, action: AppActionsType): I_dataState => {
  switch (action.type) {
    case formsActionTypes.SET_FETCHED_DATA: {
      let newState = {...state};
      if (action.dataType === 'user') {
        newState.user = {};
      }
      if (action.dataType === 'forms') {
        newState.forms = {};
      }
      action.data.forEach((d: DataPayloadType) => {
        if (isUser(d)) {
          newState['user'][d.id] = d as I_User;
        }
        if (isForm(d)) {
          newState['forms'][d.id] = d as FormItemType;
        }
      });
      return newState;
    }
    case formsActionTypes.ADD_NEW_FORM_FIELD: {
      let form = state.forms[action.formId];
      if (!form) {
        return state;
      }
      const newField = getNewField();
      form = {
        ...form,
        fields: {...form.fields, [newField.id]: newField},
        fieldsIds: [...form.fieldsIds, newField.id]//.splice(action.index, 0, newField.id)
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [form.id]: form
        }
      }
    }
    case formsActionTypes.ADD_NEW_FORM: {
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.form.id]: action.form
        },
        editingFormId: action.form.id
      }
    }
    case formsActionTypes.SET_EDITING_FIELD: {
      if (state.editingFieldId === action.fieldId) {
        return state;
      }
      return {
        ...state,
        editingFieldId: action.fieldId
      }
    }
    case formsActionTypes.UPDATE_ITEM_SUCCESS: {
      if (!state.forms[action.data.id]) {
        return state;
      }
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.data.id]: {...state.forms[action.data.id], ...action.data}
        }
      }
    }
    case formsActionTypes.UPDATE_FIELD: {
      let editingForm = state.forms[action.formId];
      if (editingForm && editingForm.fields[action.fieldId]) {
        let newForm = {...editingForm};
        newForm.fields[action.fieldId] = {...newForm.fields[action.fieldId], ...action.field};
        return {
          ...state,
          forms: {...state.forms, [action.formId]: newForm},
        }
      }
      return state;
    }
    case formsActionTypes.DELETE_FIELD: {
      if (state.editingFormId && state.editingFieldId && state.forms[action.formId]) {
        let newForm = {...state.forms[action.formId]};
        delete newForm.fields[state.editingFieldId];
        newForm.fieldsIds = [...newForm.fieldsIds].filter(id => id !== state.editingFieldId);
        return {
          ...state,
          forms: {...state.forms, [action.formId]: newForm},
          editingFieldId: ''
        }
      }
      return state;
    }
    case formsActionTypes.DELETE_FORM: {
      if (state.editingFormId && state.forms[action.formId]) {
        let newForms = {...state.forms};
        delete newForms[action.formId];
        return {
          ...state,
          forms: newForms,
          editingFieldId: ''
        }
      }
      return state;
    }
    default:
      return state;
  }
};

export default formsReducer;