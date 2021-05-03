import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {EditOutlined} from '@ant-design/icons';
import './forms.css';
import {Select, Typography} from "antd";
import {FieldItem, withOptionsTypes} from "../../types/form-types";
import {getRule} from "../../redux/forms/reducer";

const {Text} = Typography;

interface IProps {
  formId: string
  field: FieldItem
  setEditingFieldCallback?: () => void
  onChange: (value: string) => void
}

const FieldItemPreview: React.FC<IProps> = React.memo(({field, onChange, setEditingFieldCallback}) => {
  const [value, setValue] = useState<string>(field.value ? field.value : field.defaultValue ? field.defaultValue : '');
  const [optsValue, setOptsValue] = useState<string[]>(field.value ? field.value.split('__') : field.defaultValue ? field.defaultValue.split('__') : []);
  const [touched, setTouched] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | undefined | null>('');

  const validate = (val: string) => {
    let err: string | undefined | null = null;
    const rules = [...field.rules];
    if (field.mandatory) {
      rules.unshift(getRule('mandatory'))
    }
    for (let i = 0; i < rules.length; i ++) {
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
    if (value !== field.value && !touched) {
      setTouched(true)
    }
    if (value && value === field.value && touched) {
      setTouched(false)
    }
  }, [value]);

  useEffect(() => {
    if (touched && !active) {
      validate(value);
      onChange(value);
    }
  }, [active]);

  const onChangeCallback = useCallback((val: string) => {
    let finalVal = val;
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
  }, [validationError, active, optsValue]);

  const defaultProps = {
    onBlur: () => setActive(false),
    onFocus: () => {
      setTouched(true);
      setActive(true);
    },
    onChange:(event: any) => onChangeCallback(event.target.value),
    type: field.inputType,
    name: field.id
  };

  return (
    <div className="form-item-wrapper">
      <div className="form-item-header">
        <h3 className={`form-title ${field.mandatory ? 'required' : ''}`}>
          {field.title}
        </h3>
        {setEditingFieldCallback &&
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
                : <div>
                  <input
                    {...defaultProps}
                    className="ant-input"
                  />
                </div>
        }
      </div>
    </div>
  )
});

export default FieldItemPreview;