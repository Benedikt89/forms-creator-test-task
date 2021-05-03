import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {getLocale} from "../../constants/languageType";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {selectForm, selectIsFormOwner} from "../../redux/forms/selectors";
import {PlusOutlined} from '@ant-design/icons';
import FormHeader from "../../components/forms/FormHeader";
import {addNewForm, addNewFormField, deleteForm, fetchFormsData, onFormUpdate,} from "../../redux/forms/actions";
import FieldItemWrapper from "../../components/forms/FieldItemWrapper";
import {Button, Spin} from "antd";
import {useHistory, useParams} from "react-router";
import {selectFetchingByKey, selectUserData} from "../../redux/app/selectors";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const FormsPage: React.FC = () => {
  const history = useHistory();
  let {formid} = useParams<{ formid: string }>();
  const {language, form, forms, isOwner, formLoading, loading, userData} = useSelector((state: AppStateType) =>
    ({
      language: state.app.language,
      form: selectForm(state, formid),
      userData: selectUserData(state),
      forms: state.forms.forms,
      isOwner: selectIsFormOwner(state, formid),
      formLoading: selectFetchingByKey(state, `form__${formid}`),
      loading: selectFetchingByKey(state, "fetchFormData"),
    }));
  const [idsArray, setIdsArray] = useState<string[]>(form ? form.fieldsIds : []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFormsData())
  }, []);

  useEffect(() => {
    form && setIdsArray(form.fieldsIds);
  }, [form]);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragFieldId = form && idsArray[dragIndex];
      if (dragFieldId) {
        let newIds = [...idsArray];
        newIds.splice(dragIndex, 1);
        newIds.splice(hoverIndex, 0, dragFieldId);
        setIdsArray(() => newIds)
      }
    },
    [idsArray],
  );

  return (
    <div className="forms-page-wrapper">
      <h2>{getLocale(language, 'forms_page_header')}</h2>
      <Spin spinning={loading}>
        <div className="row">
          {Object.keys(forms).map((key: string) => (<div
            key={key} className={`form-item-button ${key === formid ? 'selected' : ''}`}
            onClick={() => history.push(`/forms/${key}`)}>
            <span>{forms[key].title}</span>
          </div>))}
          <Button loading={loading} type="text" onClick={() => dispatch(addNewForm())}>
            <PlusOutlined /> {getLocale(language, 'form')}
          </Button>
        </div>
        {form && <div>
          <FormHeader title={form.title} isOwner={isOwner} description={form.description}
                      loading={loading || formLoading}
                      onChange={(key: string, val: string) => form && dispatch(onFormUpdate({...form, [key]: val}))}
                      onDelete={() => dispatch(deleteForm(formid))}
          />
          <DndProvider backend={HTML5Backend}>
            {idsArray.map((id: string, i: number) => !form.fields[id] ? null : (
              <FieldItemWrapper
                key={id}
                index={i}
                moveCard={moveCard}
                isOwner={isOwner}
                formId={form.id}
                field={form.fields[id]}
                userId={userData ? userData.id : ''}
              />
            ))}
          </DndProvider>
          <div className="row space-around">
            {isOwner &&
            <Button
                loading={formLoading} type="primary"
                onClick={() => dispatch(addNewFormField(form.id, 0))}>
              <PlusOutlined /> {getLocale(language, 'field')}
            </Button>}
            <Button loading={formLoading} type="primary"
                    onClick={() => form && dispatch(onFormUpdate({...form, fieldsIds: idsArray}))}>
              {getLocale(language, 'save')}
            </Button>
          </div>
        </div>}
      </Spin>
    </div>
  )
};

export default FormsPage;