import React, {useEffect, useState} from 'react';
import { useParams } from "react-router";

import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardContent,
    Grid
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  JsonView
} from './components';
import _data from './data';
import { getBcoById } from 'service/bco';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  preWrap: {
    whiteSpace: 'pre-wrap'
  }
}));

const Detail = (props) => {
  const [ data, setData ] = useState(_data);
  let { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      props.updateLoading(true);
      let result = await getBcoById(id);
      if (result.status === 200) {
        setData(result.result);
      } else {
        // history.goBack();
        history.push('/dashboard');
      }
      props.updateLoading(false);
    }
    fetchData();
  }, []);

  const onDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 4)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `bco_${id}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
          <JsonView data={data} onDownload={onDownload} />
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <Card>
            <CardContent>
              <pre className={classes.preWrap}>{JSON.stringify(data, null, 4)}</pre>
            </CardContent>
          </Card>
        </Grid>        
      </Grid>
    </div>
  );
};

export default Detail;
