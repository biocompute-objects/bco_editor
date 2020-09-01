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
import { setInitial } from 'service/utils';

// For JSON trees.
// Source:  https://dev.to/baso53/recursive-rendering-in-react-building-a-universal-json-renderer-f59
import RecursiveComponent from 'react-json-component';

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

  console.log('this.props')
  console.log(props)

  useEffect(() => {
    setInitial();
    
    async function fetchData() {
      props.updateLoading(true);
      let result = await getBcoById(id);
      if (result.status === 200) {
        
        // Re-arrange the object to ensure the proper field order.
        var rearranged = {};

        // Set the header keys.
        rearranged['Object ID'] = result.result.object_id;
        rearranged['Spec Version'] = result.result.spec_version;
        rearranged['eTag'] = result.result.etag;

        // Set the main keys.
        rearranged['Description Domain'] = result.result.description_domain;
        rearranged['Error Domain'] = result.result.error_domain;
        rearranged['Execution Domain'] = result.result.execution_domain;
        rearranged['Extension Domain'] = result.result.extension_domain;
        rearranged['IO Domain'] = result.result.io_domain;
        rearranged['Parametric Domain'] = result.result.parametric_domain;
        rearranged['Provenance Domain'] = result.result.provenance_domain;
        rearranged['Usability Domain'] = result.result.usability_domain;

        // Go through all keys and replace any key with dashes with 
        // a properly capitalized key.

        // First, find which keys have this property of having dashes.
        
        // Define an array to hold the absolute paths.
        var dashed_paths = [];
        console.log(rearranged);

        // Go over each path.
        // Source: https://qvault.io/2019/09/22/thinking-about-recursion-how-to-recursively-traverse-json-objects-and-the-filesystem/
        function capture_paths(obj) {
          for (let k in obj) {

            if (typeof obj[k] === "object") {
              console.log('object here')

              // If the object has a dash in its name,
              // then append to dashed_paths.
              //if(indexOf())

              capture_paths(obj[k])
            } else {
              // base case, stop recurring
              dashed_paths.push(obj[k]);
            }
          }
        }

        // Call the function.
        capture_paths(rearranged)

        // What did we get?
        console.log(dashed_paths);

        setData(rearranged);
      } else {
        // history.goBack();
        history.push('/dashboard');
      }
      props.updateLoading(false);
    }
    fetchData();
  }, []);

  // For toggling object views.
  // Source: https://material-ui.com/components/toggle-button/

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
                <pre className={classes.preWrap}>
                <RecursiveComponent
                          property={data}
                          propertyName="BCO Information"
                          excludeBottomBorder={false}
                          rootProperty={true} />
                </pre>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                <pre className={classes.preWrap}>
                    Raw BCO (JSON) <br />
                    {JSON.stringify(data, null, 4)}
                  </pre>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
  );
};

export default Detail;
