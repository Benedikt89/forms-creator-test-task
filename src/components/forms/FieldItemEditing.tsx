import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {CheckOutlined, DeleteOutlined, EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import './forms.css';
import {Button, Dropdown, Menu, Select, Switch, Tooltip, Typography} from "antd";
import {FieldItem, FieldTypes, RulesTypes, withOptionsTypes} from "../../types/form-types";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {deleteField, setEditingField, updateField} from "../../redux/forms/actions";
import {v4 as uuid} from 'uuid';
import {getLocale} from "../../constants/languageType";
import {getRule, ruleTypes, ruleUniqTypes} from "../../redux/forms/reducer";

const { Option } = Select;

interface IProps {
  formId: string
  field: FieldItem
}

const fieldTypesOptions:{value: FieldTypes, title: string}[] = [
  {value: 'text', title: 'field'},
  {value: 'textarea', title: 'textarea'},

  {value: 'radio', title: 'radio'},
  {value: 'checkbox', title: 'checkbox'},
  {value: 'select', title: 'select'},

  {value: 'range', title: 'range'},
  {value: 'date', title: 'date'},
  {value: 'time', title: 'time'},
  {value: 'password', title: 'password'},
];

const FieldItemEditing: React.FC<IProps> = ({formId, field}) => {
  const {language, editingFieldId} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
      editingFieldId: state.forms.editingFieldId
    }));
  const dispatch = useDispatch();
  const [fieldCopy, setFieldCopy] = useState<FieldItem>(field);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleOuterClick = useCallback(() => {
    dispatch(setEditingField(''));
  }, []);


  const updateFieldCopy = useCallback((key, value) => setFieldCopy((prev: FieldItem) =>
    ({...prev, [key]: value})), [fieldCopy]);


  useEffect(() => {

    return () => {
      dispatch(updateField(field.id, fieldCopy));
    }
  }, [fieldCopy]);
  //useOnClickOutside(wrapperRef, handleOuterClick);

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
  const updateRule = (index: number, value: number) => {
    let newRules = [...fieldCopy.rules];
    newRules[index] = {...newRules[index], ...getRule(newRules[index].type, value)};
    updateFieldCopy('rules', newRules);
  };

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

  return (
    <div className="form-item-wrapper" ref={wrapperRef}>
      <div className="form-item-editing-header">
        <input
          type="text"
          className="ant-input"
          onChange={event => updateFieldCopy('title', event.target.value)}
          value={fieldCopy.title}
        />
        <Select defaultValue={fieldCopy.inputType} style={{width: 120}}
                onChange={(val: FieldTypes) => updateFieldCopy('inputType', val)}>
          {fieldTypesOptions.map(obj => (<Option value={obj.value}>{obj.title}</Option>))}
        </Select>
      </div>
      {fieldCopy.displayDescription && <textarea id="story" name="story"
                                                 rows={2} cols={1}
                                                 className="ant-input"
                                                 onChange={event => updateFieldCopy('description', event.target.value)}
                                                 value={fieldCopy.description}
      />}
      <div>
        {fieldCopy.inputType === 'select' || withOptionsTypes.includes(fieldCopy.inputType)
        ? <div>
          {fieldCopy.options.map((option, i) => (
              <div key={option.value} className="form-item-editing-option">
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
          <Button type="text" onClick={() => changeFieldOptions()}><PlusOutlined /> ADD</Button>
        </div> : null}
      </div>

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
        <Dropdown trigger={['click']} overlay={() => <Menu onClick={({ key }: {key: RulesTypes} & any) => changeRules(key)}>
          {[...ruleTypes, ...ruleUniqTypes]
            .filter(type => !fieldCopy.rules.map(r => r.type).includes(type))
            .map((type) => <Menu.Item key={type} >{type}</Menu.Item>)}
        </Menu>}>
          <Button type="text"><PlusOutlined /> ADD Rule</Button>
        </Dropdown>
      </div>


      <div className="form-item-editing-footer">
        <Tooltip title={getLocale(language, 'delete')}>
          <DeleteOutlined onClick={() => dispatch(deleteField())}/>
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