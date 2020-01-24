import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { checkAuthToken } from '../../service/user'

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        !checkAuthToken() ?
          <Layout>
            <Component {...matchProps} />
          </Layout>
        :
          <Redirect
            to={{
              pathname: '/dashboard',
              state: { from: props.location }
            }}
          />
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
