import * as React from "react";
import {useCallback} from "react";
import './forms.css';
import FieldItemEditing from "./FieldItemEditing";
import {useDispatch, useSelector} from "react-redux";
import {setEditingField, updateField} from "../../redux/forms/actions";
import {AppStateType} from "../../redux/store";
import {FieldItem} from "../../types/form-types";
import FieldItemPreview from "./FieldItem";

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
    ? <FieldItemEditing formId={formId} field={field}/>
    : <FieldItemPreview formId={formId} field={field}
                        onChange={val => dispatch(updateField(formId, field.id, {...field, value: val}))}
                        setEditingFieldCallback={setEditingFieldCallback}
    />
};

export default FieldItemWrapper;