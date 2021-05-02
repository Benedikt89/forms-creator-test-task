import {connect} from 'react-redux';
import * as React from 'react';
import {Redirect, Route, RouteProps,} from 'react-router-dom';
import {AppStateType} from "../../redux/store";
import {selectIsAuth} from "../../redux/app/selectors";

interface PrivateRouteProps extends RouteProps {
    component: any;
    isAuth: boolean;
}

const ProtectedRoute = (props: PrivateRouteProps) => {
    const { component: Component, isAuth, ...rest } = props;
    return (
        <Route
            {...rest}
            render={(routeProps) =>
                isAuth ? (
                    <Component {...routeProps} {...rest} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: routeProps.location }
                        }}
                    />
                )
            }
        />
    );
};

const mapStateToProps = (state: AppStateType) => ({isAuth: selectIsAuth(state)});

export default connect(mapStateToProps, {})(ProtectedRoute);
