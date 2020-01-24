import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  LatestOrders
} from './components';
import { SearchInput } from 'components';
import { getBcoList } from '../../service/bco';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const router = useHistory();
  const [origin, setOrigin] = useState([]);
  const [data, setData] = useState([]);

  const onGotoNewBco = () => {
    router.push('/bco-form/new');
  }

  useEffect(() => {
    async function fetchData() {
      props.updateLoading(true);
      let result = await getBcoList(); 
      if (result.status === 200) {
        setData(result.result);
        setOrigin(result.result);
        props.updateLoading(false);
      }      
    }

    fetchData();
  }, []);

  const onSearch = (event) => {
    let value = event.target.value;
    if (!value) {
      setData(origin)
      return;
    }
    setData(origin.filter(item => {
      if (item.provenance_domain.name.toLowerCase().includes(value.toLowerCase()))
        return true
      if (item.provenance_domain.contributors.filter(u => u.email.includes(value)).length > 0)
        return true
      return false
    }))
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <SearchInput
            placeholder="Search object"
            onChange={onSearch}
          />
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <LatestOrders data={data} onGotoNewBco={onGotoNewBco} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
