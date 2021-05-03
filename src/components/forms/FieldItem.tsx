import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {EditOutlined} from '@ant-design/icons';
import './forms.css';
import {DatePicker, Select, Typography} from "antd";
import {FieldItem, FormStatusTypes, withOptionsTypes} from "../../types/form-types";
import {customOptId, getRule} from "../../redux/forms/reducer";
import {LanguageType} from "../../constants/languageType";
import moment from "moment";

const {Text} = Typography;

interface IProps {
  formId: string
  field: FieldItem
  initValue: string
  isOwner: boolean | null | undefined
  userId: string
  requiredValidate: FormStatusTypes
  language: LanguageType
  setEditingFieldCallback?: () => void
  onChange: (formId: string, fieldId: string, field: Partial<FieldItem>) => void
}

const FieldItemPreview: React.FC<IProps> = React.memo(
  ({formId, field, onChange, initValue, isOwner, setEditingFieldCallback, requiredValidate, userId}) => {
  const [value, setValue] = useState<string>(initValue);
  const [customOptionValue, setCustomOptionValue] = useState<string>(field.customRadio && field.customRadio[userId] ? field.customRadio[userId] : '');
  const [optsValue, setOptsValue] = useState<string[]>(initValue ? initValue.split('__') : field.defaultValue ? field.defaultValue.split('__') : []);
  const [touched, setTouched] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | undefined | null>('');

  const customOptionSelected = optsValue.includes(customOptId);

  /* ==================== validate value with all the rules ==================== */
  const validate = (val: string) => {
    let err: string | undefined | null = null;
    const rules = [...field.rules];
    if (field.mandatory) {
      rules.unshift(getRule('mandatory'))
    }
    for (let i = 0; i < rules.length; i++) {
      if (!err) {
        err = rules[i].callBack(val);
        if (err) {
          i = rules.length
        }
      }
    }
    setValidationError(err);
  };

  useEffect(() => {
    /* ==================== validate on reducer variable change ==================== */
    if (requiredValidate === 'validating') {
      validate(value);
    }
  }, [requiredValidate]);

  useEffect(() => {
    if (value !== initValue && !touched) {
      setTouched(true)
    }
    if (value && value === initValue && touched) {
      setTouched(false)
    }
  }, [value]);

  useEffect(() => {
    /* ==================== validate on blur, if no errors, update reducer ==================== */
    if (touched && !active) {
      validate(value);
      let newObject = {...field, values: {...field.values, [userId]: value}};
      if (customOptionSelected) {
        newObject.customRadio = newObject.customRadio
          ? {...newObject.customRadio, [userId]: customOptionValue}
          : {[userId]: customOptionValue}
      }
      onChange(formId, field.id, newObject);
    }
  }, [active]);

  const onChangeCallback = useCallback((val: string) => {
    let finalVal = val;
    /* ==================== storing selected options id's in string ==================== */
    if (field.inputType === 'checkbox' && value.length) {
      let arr = [...optsValue];
      if (arr.includes(val)) {
        arr = arr.filter(id => id !== val);
      } else {
        arr.push(val)
      }
      setOptsValue(arr);
      finalVal = arr.join('__');
    }
    if (validationError) {
      validate(finalVal);
    }
    setValue(finalVal);
  }, [field, value, validationError, active, optsValue]);

    /* ==================== default input props ==================== */
  const defaultProps = {
    onBlur: () => setActive(false),
    onFocus: () => {
      setTouched(true);
      setActive(true);
    },
    onChange: (event: any) => onChangeCallback(event.target.value),
    type: field.inputType,
    name: field.id
  };

  return (
    <div className="form-item-wrapper">
      <div className="form-item-header">
        <h3 className={`form-title ${field.mandatory ? 'required' : ''}`}>
          {field.title}
        </h3>
        {isOwner && setEditingFieldCallback &&
        <EditOutlined className="icon-button form-item-header-icon" style={{color: '#177ddc'}}
                      onClick={setEditingFieldCallback}/>}
      </div>

      <div className="form-item-content">
        {validationError && <span style={{color: 'red'}}>{validationError}</span>}
        {field.displayDescription && <Text>{field.description}</Text>}
        {
          field.inputType === 'select'
            ? <Select defaultValue={field.defaultValue} style={{width: 120}}
                      onChange={(val: string) => setValue(val)}>
              {field.options.map(obj => (<Select.Option key={obj.value} value={obj.value}>{obj.title}</Select.Option>))}
            </Select>
            : withOptionsTypes.includes(field.inputType)
            ? <div>
              {field.options.map((option) => (
                <div key={option.value} className="row">
                  <input
                    {...defaultProps}
                    id={option.value}
                    onChange={() => onChangeCallback(option.value)}
                    checked={field.inputType === 'checkbox' ? optsValue.includes(option.value) : option.value === value}
                    value={value}
                    className={`form-item-option-${field.inputType}`}
                  />
                  <label htmlFor={field.id}>{option.title}</label>
                </div>
              ))}
            </div>
            : field.inputType === 'textarea'
              ? <textarea defaultValue={field.defaultValue}
                          {...defaultProps}
                          rows={2} cols={1}
                          value={value}
                          className="ant-input"
              />
              : field.inputType === 'range'
                ? <>
                  <label htmlFor={field.id}>{value}</label>
                  <br/>
                  <input
                    {...defaultProps}
                    value={+value}
                    className="ant-input"
                    min={field.minRange}
                    max={field.maxRange}
                  />
                </>
                : field.inputType === 'date'
                  ? <DatePicker
                      onBlur={() => setActive(false)}
                      value={moment(value).isValid() ? moment(value) : moment()}
                      onChange={(val) => val && onChangeCallback(val.format())}
                    />
                  : <div>
                    <input
                      {...defaultProps}
                      value={value}
                      className="ant-input"
                    />
                  </div>
        }
        {customOptionSelected && <>
        <label htmlFor={field.id}>Custom</label>
        <br/>
          <input
              onBlur={() => setActive(false)}
              onFocus={() => {
                setTouched(true);
                setActive(true);
              }}
              onChange={(event: any) => setCustomOptionValue(event.target.value)}
              value={customOptionValue}
              className="ant-input"
          />
        </>}
      </div>
    </div>
  )
});

export default FieldItemPreview;