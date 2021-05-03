import * as React from "react";
import {Avatar, Button, Dropdown, Layout, Menu} from "antd";
import './Header.css';
import {Link} from "react-router-dom";
import {getLocale, languagesArr, LanguageType} from "../../constants/languageType";
import {I_UserData} from "../../types/app-types";
import logo from '../../assets/logo512.png';
import headerBackground from '../../assets/background-indexed.png';

const {Header} = Layout;

interface I_Props {
  userData: I_UserData | null,
  language: LanguageType,
  logOut: () => void
  setLanguage: (val: LanguageType) => void
}

class AppHeader extends React.Component<I_Props> {

  render() {
    const {userData, logOut, language, setLanguage} = this.props;
    let toDisplay = userData && userData.name.length > 5
      ? [...userData.name.split('')].splice(0, 5).join('')
      : userData ? userData.name : '';
    return (
      <Header className="custom-header" style={{backgroundImage: `url(${headerBackground})`}}>
        <Link to={'/'}>
          <img src={logo} className="logo" alt={'logo'}/>
        </Link>

        <Link to='/forms/empty' key="2">
          <Button type="text" style={{color: '#fff'}}>
            {getLocale(language, 'header_forms')}
          </Button>
        </Link>

        <Dropdown
          overlay={<Menu>
            {userData && <Menu.Item key="0">
              <Button type="text">
                <Link to='/profile' key="1">
                  {getLocale(language, 'header_profile')}
                </Link>
              </Button>
            </Menu.Item>}

            <Menu.Item key="1">
              <Button type="text" onClick={logOut}>
                <Link to='/login' key="2">
                  {userData ? getLocale(language, 'header_log_out') : getLocale(language, 'log_in')}
                </Link>
              </Button>
            </Menu.Item>
          </Menu>}
        >
          <div style={{float: 'right'}}>
            <Avatar
              src={userData && userData.avatar && userData.avatar}
              style={{backgroundColor: "#2F80ED", verticalAlign: 'middle'}}
              size={40}
              gap={1}
            >
              {toDisplay}
            </Avatar>
          </div>
        </Dropdown>

        <Dropdown
          overlay={<Menu>
            {languagesArr.map(lang => (
              <Menu.Item key={lang}>
                <Button type="text" onClick={() => setLanguage(lang)}>
                  {lang}
                </Button>
              </Menu.Item>
            ))}
          </Menu>}
        >
          <div style={{float: 'right', marginRight: '1rem'}}>
            <Button type="text">
              {language}
            </Button>
          </div>
        </Dropdown>
      </Header>
    )
  }
}

export default AppHeader;