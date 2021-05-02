import * as React from "react";
import {useCallback} from "react";
import {EditOutlined} from '@ant-design/icons';
import './forms.css';
import {Select, Typography} from "antd";
import FieldItemEditing from "./FieldItemEditing";
import {useDispatch, useSelector} from "react-redux";
import {setEditingField} from "../../redux/forms/actions";
import {AppStateType} from "../../redux/store";
import {FieldItem, withOptionsTypes} from "../../types/form-types";

const {Text} = Typography;

interface IProps {
  formId: string
  field: FieldItem
}

const FieldItemWrapper: React.FC<IProps> = ({formId, field}) => {
  const {language, editingFieldId} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
      editingFieldId: state.forms.editingFieldId
    }));
  const dispatch = useDispatch();
  const setEditingFieldCallback = useCallback(() => dispatch(setEditingField(field.id)), [field]);

  return editingFieldId === field.id
    ? <FieldItemEditing formId={formId} field={field} />
    : (
    <div className="form-item-wrapper" >
      <div className="form-item-header">
        <h3 className={`form-title ${field.mandatory ? 'required' : ''}`}>
          {field.title}
        </h3>
        <EditOutlined className="icon-button form-item-header-icon" style={{color: '#177ddc'}} onClick={setEditingFieldCallback}/>
      </div>

      <div className="form-item-content">
        {field.displayDescription && <Text>{field.description}</Text>}
        {
          field.inputType === 'select'
            ? <Select defaultValue={field.defaultValue} style={{width: 120}}
                      onChange={(val: string) => console.log('inputType', val)}>
                {field.options.map(obj => (<Select.Option value={obj.value}>{obj.title}</Select.Option>))}
             </Select>
            : withOptionsTypes.includes(field.inputType)
            ? <div>
              {field.options.map((option) => (
                <div key={option.value} className="row">
                  <input id={option.value} type={field.inputType}
                         //checked={option.value === field.defaultValue}
                         name={field.id} value={option.value}
                         className={`form-item-option-${field.inputType}`}
                  />
                  <label htmlFor={field.id}>{option.title}</label>
                </div>
              ))}
            </div>
            : <div>
              <input
                type={field.inputType}
                className="ant-input"
              />
            </div>
        }

      </div>
    </div>
  )
};

export default FieldItemWrapper;