import {useSelector} from 'react-redux';
import * as React from 'react';
import {Redirect, Route, RouteProps,} from 'react-router-dom';
import {AppStateType} from "../../redux/store";
import {selectIsAuth} from "../../redux/app/selectors";

interface PrivateRouteProps extends RouteProps {}

export const PrivateRoute:React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  let {isAuth} = useSelector((state: AppStateType) => ({isAuth: selectIsAuth(state)}));
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
