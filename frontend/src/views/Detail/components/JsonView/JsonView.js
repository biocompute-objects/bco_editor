import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Grid,
  Button,
  colors
} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import { getUserInfo } from 'service/user';
import { getBcoIdEncoding } from 'service/utils';

// For viewing options.
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    marginTop: theme.spacing(1)
  },
  shareButton: {
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(2)
  },
  shareIcon: {
    marginRight: theme.spacing(1)
  },
  applyButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  readOnly: {
    marginRight: theme.spacing(2)
  },
  isNotVisible: {    
    display: 'none'
  }
}));

function Header({ project, className, ...rest }) {
  const [ isOwn, setOwn ] = useState(false);
  const [ title, setTitle ] = useState('');
  const classes = useStyles();
  const router = useHistory();
  const user = getUserInfo();

  const onEdit = () => {
    router.push(`/bco/${getBcoIdEncoding(rest.data.object_id)}/form`);
  }

  // For viewing options.
  const [view_type, setViewType] = React.useState('raw');

  const changeView = (event, viewType) => {
    
    // Make sure at least one button is active.
    if (viewType !== null) {

      // Update the state.
      setViewType(viewType);

    }

  };

  useEffect(() => {
    if (rest.data.id && user) {
      let users = rest.data.provenance_domain.contributors.filter(item => item.contribution.includes('createdBy'));
      users = users.filter(u => u.email === user.email);
      if (users.length > 0) setOwn(true);
    }
    if (rest.data.id) {
      setTitle(rest.data.provenance_domain.name);
    }
  }, [rest.data])
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Browse projects
          </Typography>
          <Typography
            component="h1"
            gutterBottom
            variant="h3"
          >
            {title}
          </Typography>
        </Grid>
        <Grid item>
          { isOwn ? 
            <>
              {/*<Button
                className={classes.shareButton}
                variant="contained"
              >
                <ShareIcon className={classes.shareIcon} />
                Share
              </Button> */}
              <Button
                className={classes.shareButton}
                variant="contained"
                onClick={onEdit}
              >
                <EditIcon className={classes.shareIcon} />
                Edit
              </Button>
            </>
          : <Typography variant="body1" component="body1" className={classes.readOnly}>
              Read Only
            </Typography>
          }
          {/*<ToggleButtonGroup
            value={view_type}
            exclusive
            onChange={changeView}
            aria-label="View Type"
          >
            <ToggleButton value="raw" aria-label="raw">
              Raw
            </ToggleButton>
            <ToggleButton value="tree" aria-label="tree">
              Tree
            </ToggleButton>
          </ToggleButtonGroup>*/}
          <Button
            className={classes.applyButton}
            variant="contained"
            onClick={rest.onDownload}
          >
            Download
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  project: PropTypes.object
};

Header.defaultProps = {};

export default Header;
