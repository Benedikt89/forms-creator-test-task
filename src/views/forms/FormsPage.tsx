import * as React from "react";
import {getLocale} from "../../constants/languageType";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {selectForm} from "../../redux/forms/selectors";
import FormHeader from "../../components/forms/FormHeader";
import {addNewForm, addNewFormField, deleteForm, fetchFormsData, onFormUpdate} from "../../redux/forms/actions";
import FieldItemWrapper from "../../components/forms/FieldItemWrapper";
import {Button} from "antd";
import {useHistory, useParams} from "react-router";
import {useEffect} from "react";

const FormsPage: React.FC = () => {
  const history = useHistory();
  let { formid } = useParams<{formid: string}>();
  const {language, form, forms} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
      form: selectForm(state, formid),
      forms: state.forms.forms
    }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFormsData())
  }, []);

  return (
    <div className="forms-page-wrapper">
      <div className="row">
        {Object.keys(forms).map((key: string) => (<div
          key={key} className="form-item-button"
          onClick={() => history.push(`/forms/${key}`)}>
          {forms[key].title}
        </div>))}
        <Button type="text" onClick={() => dispatch(addNewForm())}>ADD NEW</Button>
      </div>
      <h2 onClick={() => dispatch(addNewForm())}>{getLocale(language, 'forms_page_header')}</h2>
      {form && <div>
        <FormHeader title={form.title} description={form.description}
                    onChange={(val: string) => console.log('====' + val)}
                    onDelete={() => dispatch(deleteForm(formid))}
        />
        {form.fieldsIds.map((id: string) => !form.fields[id] ? null : (
          <FieldItemWrapper key={id} formId={form.id} field={form.fields[id]} />
        ))}
        <Button type="primary" onClick={() => dispatch(addNewFormField(form.id, 0))} >ADD</Button>
        <div className="row">
          <Button onClick={() => dispatch(onFormUpdate(formid))}>save</Button>
        </div>
      </div>}
    </div>
  )
};

export default FormsPage;