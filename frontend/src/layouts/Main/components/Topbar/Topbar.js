import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import LaunchIcon from '@material-ui/icons/Launch';
import { logout } from 'service/user';
import { onLink } from 'service/utils';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;
  const router = useHistory();
  const classes = useStyles();

  const [notifications] = useState([]);

  const onLogout = () => {
    logout();
    router.push('/sign-in');
  }  

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <div>
		<div>
			<Typography
          		className={classes.quoteText}
          		variant="h4"
          		onClick={onLink(router)}
        		>
          		BioCompute Portal 3.0.2
        		</Typography>
		</div>
		<div class = 'topbar_link_div'>
			<Typography
			className={classes.quoteText}
			variant="h6"
			>
			Conformant with <a class = 'topbar_link' href = 'https://opensource.ieee.org/2791-object/ieee-2791-schema/' target = '_blank'>IEEE 2791-2020</a>
			</Typography>
			<LaunchIcon className = 'svg_icons' />
		</div>
	</div>        
	<div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onLogout}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
	      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
