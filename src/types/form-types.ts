///


import moment, {Moment} from "moment";

export type FieldTypes = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' |
  'date' | 'time' | 'password' | 'range'

export type RulesTypes = 'min' | 'max' | 'phone' | 'email' | 'number'

export const withOptionsTypes: FieldTypes[] = ['radio', 'checkbox'];

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
  inputType: FieldTypes,
  title: string,
  defaultValue: string,
  description: string,
  displayDescription: boolean,
  mandatory: boolean,
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
  fields: {
    [key: string]: FieldItem
  }
}

export type I_formsState = {
  readonly forms: {
    [key: string]: FormItemType
  }
  readonly editingFormId: string
  readonly editingFieldId: string
}
