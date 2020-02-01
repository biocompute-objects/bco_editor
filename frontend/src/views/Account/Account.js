import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { AccountProfile, AccountDetails, Password } from './components';
import {
  getUserDetail, updateAccount, updatePassword
} from 'service/user';
import { setInitial } from 'service/utils';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = (props) => {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [dataId, setDataId] = useState('');

  useEffect(() => {
    setInitial();
    async function fetchData() {
      props.updateLoading(true);
      let user = await getUserDetail();
      if (user.status === 200) {
        if (!user.result.profile) {
          user.result.profile = {};
        }
        setData(user.result);
        setDataId(user.result.id);    
        props.updateLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateData = async _data => {
    props.updateLoading(true);
    await updateAccount(_data, dataId);
    setData(_data);
    props.updateLoading(false);
    props.setAlertData({ message: 'Successfully updated!', type: 'success'});
    props.setOpenAlert(true);
  }

  const onSetMessage = async message => {
    props.setAlertData({ message: message, type: 'error'});
    props.setOpenAlert(true); 
  }

  const onUpdatePassword = async password => {
    props.updateLoading(true);
    await updatePassword(password);
    props.updateLoading(false);
    props.setAlertData({ message: 'Successfully updated!', type: 'success'});
    props.setOpenAlert(true);
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <AccountProfile data={data} update={updateData} />
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xl={8}
          xs={12}
        >
          <AccountDetails data={data} update={updateData} />
          <Password onUpdatePassword={onUpdatePassword} onSetMessage={onSetMessage} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
