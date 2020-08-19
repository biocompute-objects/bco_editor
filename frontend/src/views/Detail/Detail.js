import React, {useEffect, useState} from 'react';
import { useParams } from "react-router";

import { makeStyles } from '@material-ui/styles';
import {
    Grid
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  JsonView
} from './components';
import _data from './data';
import { getBcoById } from 'service/bco';
import { setInitial } from 'service/utils';

// For creating the JSON table.
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
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
    setInitial();
    
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

  // Define the meta information.
  const object_id = data.object_id;
  const etag = data.etag;
  const spec_version = data.spec_version;

  // Define each of the domains.
  const provenance_domain = data.provenance_domain;

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
          <PerfectScrollbar>
          <Table
            className={classes.table}
          >
            <TableBody>
                <TableRow>
                  <TableCell>Object ID</TableCell>
                  <TableCell>eTag</TableCell>
                  <TableCell>Spec Version</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{object_id}</TableCell>
                  <TableCell>{etag}</TableCell>
                  <TableCell>{spec_version}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
          <Table
            className={classes.table}
          >
            <TableBody>
                <TableRow>
                  <TableCell className = 'domain-header'>Provenance Domain</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className = 'field'>Name</TableCell>
                  <TableCell>{provenance_domain.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class = 'field'>Version</TableCell>
                  <TableCell>{provenance_domain.version}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class = 'field'>Obsolete After</TableCell>
                  <TableCell>DATE</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class = 'field'>Embargo</TableCell>
                  <TableCell colspan = '2'></TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Modified</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>DATE</TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell></TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell></TableCell>
                  <TableCell>DATE</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contributors</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Affiliation</TableCell>
                  <TableCell>e-Mail</TableCell>
                  <TableCell>ORCID</TableCell>
                  <TableCell>Contribution</TableCell>
                </TableRow>
                {
                  provenance_domain.contributors.map((contributor, i) => {

                    // Return the information for each contributor.
                    return(
                      <TableRow key={i}>
                        <TableCell></TableCell>
                        <TableCell>{contributor.name}</TableCell>
                        <TableCell>{contributor.affiliation}</TableCell>
                        <TableCell>{contributor.email}</TableCell>
                        <TableCell>{contributor.orcid}</TableCell>
                        <TableCell>{contributor.orcid}</TableCell>
                      </TableRow>

                      )

                  })
                }
                <TableRow>
                  <TableCell>License</TableCell>
                  <TableCell>{provenance_domain.license}</TableCell>
                </TableRow>
        </TableBody>
          </Table>
        </PerfectScrollbar>
        </Grid>        
      </Grid>
    </div>
  );
};

export default Detail;
