import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import Upload from 'material-ui-upload/Upload';


const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2),
    position: 'relative'
  },
  fileInput: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [user, setUser] = useState({
    name: 'Shen Zhi',
    city: 'Los Angeles',
    country: 'USA',
    timezone: 'GTM-7',
    avatar: 'https://i.imgur.com/08YLHX5.png'
  });

  const onFileLoad = (e, file) => console.log(e.target.result, file.name); 

  const onInputChange = async (e) => {
    console.log(e.target.files[0]);
    let avatar = e.target.files[0]

    if (avatar) {
        var reader = new FileReader();
        await props.uploadAvatar(avatar);
        reader.onload = function(e) {
          // $('#blah').attr('src', e.target.result);
          user.avatar = e.target.result;
          setUser({ ...user, avatar: e.target.result })          
        }
        
        reader.readAsDataURL(avatar);
      }
  };

  useEffect(() => {
    if (props.data.profile) {
      console.log(props.data.profile);
      setUser({...props.data, avatar: props.data.profile.picture ? props.data.profile.picture : 'https://i.imgur.com/08YLHX5.png'});
    }
  }, [props.data]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {props.data.first_name && `${props.data.first_name} ${props.data.last_name}`}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {user.city || ''}, {user.country || ''}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >              
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
        </div>
        {/*<div className={classes.progress}>
                  <Typography variant="body1">Profile Completeness: 70%</Typography>
                  <LinearProgress
                    value={70}
                    variant="determinate"
                  />
                </div>*/}
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.uploadButton}
          color="primary"
          variant="text"
        >
          Upload picture
          <input
            className={classes.fileInput}
            type="file"
            multiple
            onChange={onInputChange}
          />
        </Button>          
        <Button variant="text">Remove picture</Button>
      </CardActions>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
