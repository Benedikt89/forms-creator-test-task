import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router";
import {connect} from "react-redux";
import {selectErrorByKey, selectFetchingByKey, selectUserData} from "./redux/app/selectors";
import {AppStateType} from "./redux/store";
import Header from "./components/Header/Header";
import LoginForm from "./views/login/LogInForm";
import UserRegisterForm from "./views/register/RegisterForm";
import PrivateRoute from "./components/common/ProtectedRoute";
import {I_UserData} from "./types/app-types";
import {setLanguage, setUserData} from "./redux/app/actions";
import {LanguageType} from "./constants/languageType";
import FormsPage from "./views/forms/FormsPage";

interface I_props {}

interface I_connectedProps {
  error: { message: string } | null
  isFetching: boolean,
  userData: I_UserData | null
  language: LanguageType
}

interface I_dispatchedProps {
  setUserData: (data: I_UserData | null) => void
  setLanguage: (val: LanguageType) => void
}

interface I_MainProps extends I_props, I_connectedProps, I_dispatchedProps {}

interface I_MainState {
  mounted: boolean
}

class Main extends Component<I_MainProps, I_MainState> {
  constructor(props: I_MainProps) {
    super(props);
    this.state = {
      mounted: false
    }
  }

  render() {
    const {setUserData, userData, language, setLanguage} = this.props;
    return (
      <div className={"main-wrapper"}>
        <main>
          <Header userData={userData}
                  setLanguage={setLanguage}
                  language={language}
                  logOut={() => setUserData(null)}/>
          <div className={"content-wrapper"}>
            <Switch>
              <Route exact path="/"
                     render={() => <Redirect to={"/forms/empty"}/>}/>
              <Route exact path="/login"
                     component={() => <LoginForm />}/>
              <Route exact path="/register"
                     component={() => <UserRegisterForm />}/>
              <PrivateRoute exact path="/forms/:formid">
                <FormsPage />
              </PrivateRoute>
              <PrivateRoute path="/profile">
                <UserRegisterForm user={userData} />
              </PrivateRoute>

              <Route path="*" render={() => <div>Error 404</div>}/>
            </Switch>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state: AppStateType): I_connectedProps => {
  return {
    error: selectErrorByKey(state, 'fetchTickets'),
    isFetching: selectFetchingByKey(state, 'fetchTickets'),
    userData: selectUserData(state),
    language: state.app.language
  }
};

let ComposedComponent = connect(
  mapStateToProps, {setUserData, setLanguage}
)(Main);

export default ComposedComponent;