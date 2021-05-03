import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {CheckOutlined, DeleteOutlined, EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import './forms.css';
import {Button, Dropdown, Menu, Select, Switch, Tooltip} from "antd";
import {FieldItem, FieldTypes, RulesTypes, withOptionsTypes} from "../../types/form-types";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {deleteField, setEditingField, updateField} from "../../redux/forms/actions";
import {v4 as uuid} from 'uuid';
import {getLocale, LanguageType} from "../../constants/languageType";
import {customOptId, getRule, ruleTypes, ruleUniqTypes} from "../../redux/forms/reducer";

const { Option } = Select;

interface IProps {
  formId: string
  language: LanguageType
  field: FieldItem
}

const fieldTextOptions:{value: FieldTypes, title: string}[] = [
  {value: 'text', title: 'field'},
  {value: 'textarea', title: 'textarea'},
];
const fieldSelectOptions:{value: FieldTypes, title: string}[] = [
  {value: 'radio', title: 'radio'},
  {value: 'checkbox', title: 'checkbox'},
  {value: 'select', title: 'select'},
];
const fieldTimeOptions:{value: FieldTypes, title: string}[] = [
  {value: 'range', title: 'range'},
  {value: 'date', title: 'date'},
  {value: 'time', title: 'time'},
];

const FieldItemEditing: React.FC<IProps> = ({formId, field}) => {
  const {language} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
    }));
  const dispatch = useDispatch();
  const [fieldCopy, setFieldCopy] = useState<FieldItem>(field);

  const updateFieldCopy = useCallback((key, value) => setFieldCopy((prev: FieldItem) =>
    ({...prev, [key]: value})), [fieldCopy]);

  const updateFieldOption = (index: number, value: string) => {
    let newOptions = [...fieldCopy.options];
    newOptions[index] = {...newOptions[index], title: value};
    updateFieldCopy('options', newOptions);
  };

  const changeFieldOptions = (id?: string) => {
    let newOptions = [...fieldCopy.options];
    if (id) {
      newOptions = newOptions.filter(option => option.value !== id);
    } else {
      newOptions.push({value: uuid(), title: 'Option' + fieldCopy.options.length})
    }
    updateFieldCopy('options', newOptions);
  };

  const addCustomOption = () => {
      let newOptions = [...fieldCopy.options, {value: customOptId, title: 'Custom Option'}];
      updateFieldCopy('options', newOptions);
      updateFieldCopy('customRadio', {});
    };

  const updateRule = (index: number, value: number) => {
    let newRules = [...fieldCopy.rules];
    newRules[index] = {...newRules[index], ...getRule(newRules[index].type, value)};
    updateFieldCopy('rules', newRules);
  };
  /* ==================== select only one rule as email/phone/number, if exists, replace ==================== */
  const changeRules = (type: RulesTypes, remove?: boolean) => {
    let newRules = [...fieldCopy.rules];
    let toDeleteRuleIndex = ruleUniqTypes.includes(type) ? -1 : -2;
    fieldCopy.rules.forEach((r, i) => {
      if (toDeleteRuleIndex === -1 && ruleUniqTypes.includes(r.type)) {
        toDeleteRuleIndex = i;
      }
      if (remove && r.type === type) {
        toDeleteRuleIndex = i;
      }
    });
    if (toDeleteRuleIndex >= 0) {
      newRules.splice(toDeleteRuleIndex, 1);
    }
    if (!remove)  {
      if (type === 'min') {
        updateFieldCopy('mandatory', true);
      }
      newRules.push(getRule(type, type === 'max' ? 15 : 5))
    }
    updateFieldCopy('rules', newRules);
  };

  useEffect(() => {

    return () => {
      dispatch(updateField(formId, field.id, fieldCopy));
    }
  }, [fieldCopy]);

  return (
    <div className="form-item-wrapper">
      <div className="form-item-editing-header">
        <input
          type="text"
          className="ant-input"
          onChange={event => updateFieldCopy('title', event.target.value)}
          value={fieldCopy.title}
        />
        <Select defaultValue={fieldCopy.inputType} style={{width: 120}}
                onChange={(val: FieldTypes) => updateFieldCopy('inputType', val)}>
          {fieldTextOptions.map(obj => (<Option key={obj.value} value={obj.value}>{obj.title}</Option>))}
          {fieldSelectOptions.map((obj, i) =>
            (<Option
              key={obj.value}
              style={i === 0 ? {marginTop: '1rem'} : i === fieldSelectOptions.length - 1 ? {marginBottom: '1rem'} : {}}
              value={obj.value}>
              {obj.title}
            </Option>))}
          {fieldTimeOptions.map(obj => (<Option key={obj.value} value={obj.value}>{obj.title}</Option>))}
        </Select>
      </div>

      {fieldCopy.displayDescription && <textarea id="story" name="story"
                                                 rows={2} cols={1}
                                                 className="ant-input"
                                                 style={{marginBottom: '1rem'}}
                                                 onChange={event => updateFieldCopy('description', event.target.value)}
                                                 value={fieldCopy.description}
      />}

      <div>
        {fieldCopy.inputType === 'select' || withOptionsTypes.includes(fieldCopy.inputType)
        ? <div>
          {fieldCopy.options.map((option, i) => (
              <div key={option.value} className={`form-item-editing-option ${option.value === customOptId && 'custom'}`}>
                {fieldCopy.inputType !== 'select' ? <input
                  type={fieldCopy.inputType}
                  className={`form-item-option-${fieldCopy.inputType}`}
                  onClick={e => e.preventDefault()}
                /> : <span>{i}. </span>}
                <input
                  type="text"
                  className="ant-input"
                  onChange={event => updateFieldOption(i, event.target.value)}
                  value={option.title}
                />
                {fieldCopy.inputType !== 'radio' && <input
                  type="radio"
                  name="defaultValue"
                  checked={option.value === fieldCopy.defaultValue}
                  value={option.value}
                  className={"form-item-option-radio"}
                  onClick={() => updateFieldCopy('defaultValue', option.value)}
                />}
                <DeleteOutlined className="icon-button" onClick={() => changeFieldOptions(option.value)}/>
              </div>
          ))}
            <div className="row space-around">
              <Button type="text" onClick={() => changeFieldOptions()}>
                <PlusOutlined />{getLocale(language, 'option')}
              </Button>
              <Button type="text" onClick={() => addCustomOption()}
                disabled={fieldCopy.options.filter(o => o.value === customOptId).length >= 1} >
                <PlusOutlined />{getLocale(language, 'custom')}
              </Button>
            </div>
        </div> : null}
      </div>

      {fieldCopy.inputType === 'range' && <div>
        <div className="form-item-editing-option">
          <input
              type="number"
              className="ant-input"
              onChange={event => updateFieldCopy('minRange', +event.target.value)}
              value={fieldCopy.minRange}
          />
          <input
              type="number"
              className="ant-input"
              onChange={event => updateFieldCopy('maxRange', +event.target.value)}
              value={fieldCopy.maxRange}
          />
        </div>
      </div>}
      <div>
        {fieldCopy.rules.map((rule, i) => {
          return (
            <div key={rule.type} className="form-item-editing-option">
              <span>{rule.type}</span>
              {ruleTypes.includes(rule.type) ? <input
                type="number"
                className="ant-input"
                onChange={event => updateRule(i, +event.target.value)}
                value={rule.ruleVal}
              /> : <span> </span>}
              <DeleteOutlined className="icon-button" onClick={() => changeRules(rule.type, true)}/>
            </div>
          )
        })}
        {field.inputType === 'text' || field.inputType === 'textarea'
        && <Dropdown trigger={['click']} overlay={() => <Menu onClick={({ key }: {key: RulesTypes} & any) => changeRules(key)}>
          {[...ruleTypes, ...ruleUniqTypes]
            .filter(type => !fieldCopy.rules.map(r => r.type).includes(type))
            .map((type) => <Menu.Item key={type} >{type}</Menu.Item>)}
        </Menu>}>
          <Button type="text"><PlusOutlined />Rule</Button>
        </Dropdown>}
      </div>

      <div className="form-item-editing-footer">
        <Tooltip title={getLocale(language, 'delete')}>
          <DeleteOutlined onClick={() => dispatch(deleteField(formId))}/>
        </Tooltip>
        <Tooltip title={getLocale(language, 'displayDescription')}>
          <EllipsisOutlined onClick={() => updateFieldCopy('displayDescription', true)}/>
        </Tooltip>
        <div className="vertical-devider" />
        <Tooltip title={getLocale(language, 'mandatory')}>
          <Switch size="small" checked={fieldCopy.mandatory} onChange={(val) => updateFieldCopy('mandatory', val)} />
        </Tooltip>

        <Tooltip title={getLocale(language, 'save')}>
          <CheckOutlined style={{color: 'green'}} onClick={() => dispatch(setEditingField(''))}/>
        </Tooltip>
      </div>
    </div>
  )
};

export default FieldItemEditing;