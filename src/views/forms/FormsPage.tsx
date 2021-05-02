import * as React from "react";
import {getLocale} from "../../constants/languageType";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {selectForm} from "../../redux/forms/selectors";
import {newFormId} from "../../redux/forms/reducer";
import FormHeader from "../../components/forms/FormHeader";
import {addNewForm, addNewFormField} from "../../redux/forms/actions";
import FieldItemWrapper from "../../components/forms/FieldItemWrapper";
import {Button} from "antd";


const FormsPage: React.FC = () => {
  const {language, form} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
      form: selectForm(state, newFormId)
    }));
  const dispatch = useDispatch();

  return (
    <div className="forms-page-wrapper">
      <h2 onClick={() => dispatch(addNewForm())}>{getLocale(language, 'forms_page_header')}</h2>
      {form && <div>
        <Button type="primary" onClick={() => dispatch(addNewFormField(form.id, 0))} >ADD</Button>
        <FormHeader title={form.title} description={form.description} onChange={(val: string) => console.log('====' + val)}/>
        {form.fieldsIds.map((id: string) => !form.fields[id] ? null : (
          <FieldItemWrapper key={id} formId={form.id} field={form.fields[id]} />
        ))}
      </div>}
    </div>
  )
};

export default FormsPage;