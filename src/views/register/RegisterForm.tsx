import * as React from "react";
import {Button, Form, Input, Select} from 'antd';
import {I_UserData} from "../../types/app-types";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {selectFetchingByKey, selectUserData} from "../../redux/app/selectors";
import {newUserId} from "../../redux/app/reducer";
import {onUserRegister} from "../../redux/app/actions";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useState} from "react";
import {getRandomAvatar} from "../../constants/avatarImages";
import {Redirect} from "react-router";
import {getLocale} from "../../constants/languageType";

interface UserFormProps {
  user?: I_UserData | null
}

const UserRegisterForm: React.FC<UserFormProps> = ({user}) => {
  const dispatch = useDispatch();
  const {loading, userData, language} = useSelector((state: AppStateType) => ({
    language: state.app.language,
    loading: selectFetchingByKey(state, 'onUserRegister'),
    userData: selectUserData(state)
  }));
  const [touched, setTouched] = useState(false);
  const [registered, setRegistered] = useState(!userData);

  const phoneRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const defaultPrefix = "86";

  const onFinish = (values: any) => {
    dispatch(onUserRegister({
      id: user ? user.id : newUserId,
      name: values.name,
      avatar: getRandomAvatar(),
      phone: `+${values.prefix ? values.prefix : defaultPrefix}-${values.phone}`,
      password: values.password
    }));
    setRegistered(true);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    </Form.Item>
  );

  let getSplittedPhone = (string: string) => {
    let [prefix, ...rest] = string.split("-");
    let validPrefix = prefix.length === 3;
    if (!validPrefix) {
      rest.unshift(prefix)
    }
    return {prefix: validPrefix ? prefix : defaultPrefix, phone: rest.join('')};
  };

  let defaults = user ? {
    ...user,
    ...getSplittedPhone(user.phone)
  } : {
    prefix: defaultPrefix,
  };

  return userData && registered ? <Redirect to={'/'} /> : (
    <Form
      onValuesChange={() => setTouched(true)}
      name="user"
      initialValues={defaults}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        rules={[{required: true, message: getLocale(language,'error_name'), type: 'email'}]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />}
               placeholder={'placeholder_name'}/>
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
          {required: true, message: getLocale(language,'error_phone')},
          {pattern: phoneRegExp,
            message: getLocale(language,'error_valid_phone'),}
        ]}
      >
        <Input addonBefore={prefixSelector} style={{ width: '100%' }}
               placeholder={getLocale(language, 'placeholder_phone')} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: getLocale(language,'error_password')}]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={getLocale(language, 'placeholder_password')}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={!touched}>
          {getLocale(language, 'button_submit')}
        </Button>
      </Form.Item>
    </Form>
  )
};

export default UserRegisterForm;
