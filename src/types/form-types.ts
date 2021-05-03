import {Moment} from "moment";

export type DataType = 'forms' | 'user'
export type DataPayloadType = FormItemType | I_User

export type FieldTypes = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' |
  'date' | 'time' | 'password' | 'range'

export type RulesTypes = 'min' | 'max' | 'phone' | 'email' | 'number' | 'mandatory'
export type FormStatusTypes = '' | 'validating' | 'success' | 'error';

export const withOptionsTypes: FieldTypes[] = ['radio', 'checkbox'];

export type I_dataState = {
  readonly forms: {
    [key: string]: FormItemType
  }
  readonly user: {
    [key: string]: I_User
  }
  readonly editingFormId: string
  readonly editingFieldId: string
  readonly requiredValidate: FormStatusTypes
}

export type I_User = {
  id: string,
  name: string,
  avatar: string
}

export type OptionType = {
  title: string,
  value: string,
};

export type RuleItem = {
  type: RulesTypes
  ruleVal: string | number
  apply: FieldTypes[]
  callBack: (value: string | boolean | number) => string | undefined
}

export type FieldItem = {
  id: string,
  values: {
    [key: string]: string
  },
  customRadio?: {
    [key: string]: string
  },
  inputType: FieldTypes,
  title: string,
  defaultValue: string,
  description: string,
  displayDescription: boolean,
  mandatory: boolean,
  minRange: number,
  maxRange: number,
  rules: RuleItem[],
  options: OptionType[]
}

export type FormItemType = {
  id: string,
  title: string,
  creatorId: string,
  lastUpdated: Moment,
  description: string,
  fieldsIds: string[],
  confirmed: boolean,
  fields: {
    [key: string]: FieldItem
  }
}



