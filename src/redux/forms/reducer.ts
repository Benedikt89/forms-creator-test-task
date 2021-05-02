import {AppActionsType} from "../store";
import moment from "moment";
import {
  FieldItem,
  FieldTypes,
  FormItemType,
  I_formsState,
  OptionType,
  RuleItem,
  RulesTypes
} from "../../types/form-types";
import {formsActionTypes} from "./actions";
import { v4 as uuid } from 'uuid';

export const newFormId = '_NEW_FORM';

export const ruleTypes: RulesTypes[] = ['min', 'max'];
export const ruleUniqTypes: RulesTypes[] = ['phone', 'email', 'number'];

export const getRule = (type: RulesTypes, ruleVal: number = 5) => {
  const response: RuleItem = {type, apply: [], ruleVal, callBack: (value: string | boolean | number) => !value ? 'Error' : undefined};
  switch (type) {
    case "email": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value !== 'string') return 'Error';
        const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regExp.test(String(value).toLowerCase())) {
          return 'Error'
        }
      };
      break
    }
    case "phone": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value !== 'string') return 'Error';
        const regExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/i;
        if (!regExp.test(String(value).toLowerCase())) {
          return 'Error'
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
        return 'Error'
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
        return 'Error'
      };
      break;
    }
    case "number": {
      response.callBack = (value: string | boolean | number) => {
        if (typeof value === 'number') {
          return undefined;
        }
        return 'Error'
      };
      break;
    }
  }
  return response;
};

export const getNewField = (inputType: FieldTypes = 'text'): FieldItem => ({
  id: uuid(),
  inputType,
  defaultValue: '',
  title: 'Question',
  description: 'description',
  displayDescription: false,
  mandatory: false,
  rules: [],
  options: [{value: uuid(), title: 'Option'}]
});

const newForm: FormItemType = {
  id: newFormId,
  creatorId: '',
  title: 'New Form',
  description: '',
  lastUpdated: moment(),
  fields: {
    'name': {
      id: 'name',
      inputType: 'text',
      defaultValue: '',
      title: 'name',
      description: 'description',
      displayDescription: false,
      mandatory: false,
      rules: [],
      options: [{value: uuid(), title: 'Option'}]
    },
    'email': {
      id: 'email',
      inputType: 'text',
      defaultValue: '',
      title: 'email',
      description: 'description',
      displayDescription: false,
      mandatory: false,
      rules: [],
      options: [{value: uuid(), title: 'Option'}]
    },
    'gender': {
      id: 'gender',
      inputType: 'radio',
      defaultValue: '',
      title: 'gender',
      description: 'description',
      displayDescription: false,
      mandatory: false,
      rules: [],
      options: [{value: uuid(), title: 'Male'}, {value: uuid(), title: 'Female'}]
    }
  },
  fieldsIds: ['name', 'email', 'gender']
};

const initialState:I_formsState = {
  forms: {
    'person' : {...newForm, id: 'person'}
  },
  editingFormId: 'person',
  editingFieldId: ''
};

const formsReducer = (state: I_formsState = initialState, action: AppActionsType): I_formsState => {
  switch (action.type) {
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
          [newFormId]: newForm
        },
        editingFormId: newFormId
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
    case formsActionTypes.UPDATE_FIELD: {
      let editingForm = state.forms[state.editingFormId];
      if (editingForm && editingForm.fields[action.fieldId]) {
        let newForm = {...editingForm};
        newForm.fields[action.fieldId] = {...newForm.fields[action.fieldId], ...action.field};
        return {
          ...state,
          forms: {...state.forms, [state.editingFormId]: newForm},
        }
      }
      return state;
    }
    case formsActionTypes.DELETE_FIELD: {
      if (state.editingFormId && state.editingFieldId && state.forms[state.editingFormId]) {
        let newForm = {...state.forms[state.editingFormId]};
        delete newForm.fields[state.editingFieldId];
        newForm.fieldsIds = [...newForm.fieldsIds].filter(id => id !== state.editingFieldId);
        return {
          ...state,
          forms: {...state.forms, [state.editingFormId]: newForm},
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