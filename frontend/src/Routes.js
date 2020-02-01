import React, { useState } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { RouteWithLayout, RouteAuthorized } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  Dashboard as DashboardView,
  Icons as IconsView,
  Account as AccountView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Detail as DetailView,
  Form as FormView,
  SampleBCO as SampleBCOView
} from './views';
import LoadingOverlay from 'react-loading-overlay';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.default,
    height: '100%'
  }
}))

const Routes = () => {
  const [isImportLoading, setImportLoading] = useState(false);
  const [isAlert, setOpenAlert] = useState(false);
  const [alert, setAlertData] = useState({
    message: '',
    type: 'error'
  });
  const classes = useStyles();

  const handleClose = () => setOpenAlert(false);

  return (
    <LoadingOverlay
        className={classes.root}
        active={isImportLoading}
        spinner
        text=''
        >
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={isAlert} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alert.type}>
            {alert.message}
          </Alert>
        </Snackbar>

      <Switch>
        <Redirect
          exact
          from="/"
          to="/sign-in"
        />
        <RouteAuthorized
          component={DashboardView}
          exact
          layout={MainLayout}
          path="/dashboard"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteAuthorized
          component={DetailView}
          exact
          layout={MainLayout}
          path="/detail/:id"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <Route
          component={SampleBCOView}
          exact
          layout={MainLayout}
          path="/sample/bco"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteAuthorized
          component={IconsView}
          exact
          layout={MainLayout}
          path="/icons"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteAuthorized
          component={AccountView}
          exact
          layout={MainLayout}
          path="/account"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteWithLayout
          component={SignUpView}
          exact
          layout={MinimalLayout}
          path="/sign-up"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteWithLayout
          component={SignInView}
          exact
          layout={MinimalLayout}
          path="/sign-in"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteAuthorized
          component={FormView}
          exact
          layout={MainLayout}
          path="/bco-form/:id"
          updateLoading={(val)=>setImportLoading(val)}
          setAlertData={setAlertData}
          setOpenAlert={setOpenAlert}
        />
        <RouteWithLayout
          component={NotFoundView}
          exact
          layout={MinimalLayout}
          path="/not-found"
        />
        <Redirect to="/not-found" />
      </Switch>
    </LoadingOverlay>
  );
};

export default Routes;
