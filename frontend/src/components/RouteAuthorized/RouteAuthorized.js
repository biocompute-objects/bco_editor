import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { checkAuthToken } from '../../service/user'

const RouteAuthorized = props => {
  const { layout: Layout, component: Component, updateLoading, setOpenAlert, setAlertData, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        checkAuthToken() ?
          <Layout>
            <Component {...matchProps} 
              updateLoading={updateLoading}
              setOpenAlert={setOpenAlert}
              setAlertData={setAlertData}
            />
          </Layout>
        :
        <Redirect
          to={{
            pathname: '/sign-in',
            state: { from: props.location }
          }}
        />
      )}
    />
  );
};

RouteAuthorized.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteAuthorized;
