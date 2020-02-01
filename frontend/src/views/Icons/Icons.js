import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { setInitial } from 'service/utils';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  iframe: {
    width: '100%',
    minHeight: 640,
    border: 0
  }
}));

const Icons = () => {
  const classes = useStyles();

  useEffect(() => { 
    setInitial();
  }, [])

  return (
    <div className={classes.root}>
      <Typography variant='h2'>Quick Tutorial</Typography>
      <Typography variant='body2'>.</Typography>
      <Typography variant='h4'>User Registration and Activation</Typography>
      <Typography variant='body1'>To use the BCO editor, a user must login to the portal using the login credentials. Login credentials can be created through the registration form present on the home page. A user must register himself to generate the credentials for logging in to the portal.  Once a user registers himself on the portal, the user account needs to be activated by the BCO-DB admin. For the downloaded instance of the BCO editor the instructions for activating users by the BCO-DB admin can be found <a href="https://github.com/biocompute-objects/bco_editor#admin-utility" target="_blank">here</a>.</Typography>

      <Typography variant='body2'>.</Typography>
      <Typography variant='h4'>User Login</Typography>
      <Typography variant='body1'>Enter the login credentials into the designated login email and password fields. After successful login, the page navigates to the BCO editor search page where a new BCO can be created or existing BCO can be searched.</Typography>
      
      <Typography variant='body2'>.</Typography>
      <Typography variant='h4'>Creating a new BCOs</Typography>
      <Typography variant='body1'>To create a new BCO click on the link <b>“New BCOCOMPUTE Object”</b>. By clicking the link, the page navigates to the BCO editor interface page where a new BCO can be created.</Typography>
      <Typography variant='body1'>The BCO editor page displays the editable domains a BCO should have, based on the defined schema.</Typography>
      <Typography variant='body1'>Each field has its short description that helps the user to enter the correct value in the field. All the domains of the BCO can be collapsed and expanded as needed.</Typography>
      <Typography variant='body1'>The BCO can be also be created/edited by editing the JSON using the option “Edit JSON” in the BCO editor interface page.</Typography>
      <Typography variant='body1'>To view an example of the BCO click <a href="https://github.com/biocompute-objects/examples/blob/master/HCV1a.json" target="_blank">here</a> and to know more about the BCO or BCO domains click <a href="https://github.com/biocompute-objects/BCO_Specification/blob/master/user_guide.md" target="_blank">here</a>.</Typography>
      
      <Typography variant='body2'>.</Typography>
      <Typography variant='h4'>Viewing the BCO</Typography>
      <Typography variant='body1'>The BCO edited in the BCO editor can be viewed in the JSON format by clicking “View Object”. To return to the edit mode click on “Edit Object”</Typography>
      
      <Typography variant='body2'>.</Typography>
      <Typography variant='h4'>Saving the BCO</Typography>
      <Typography variant='body1'>Once all the values have been entered in the BCO editor, click on “Submit” to save and create the BCO.  Once the BCO is saved, the default BCO ID -1 gets changed to a next available positive ID.</Typography>
      
      <Typography variant='body2'>.</Typography>
      <Typography variant='h4'>Searching existing BCOs</Typography>
      <Typography variant='body1'>The existing BCOs can be searched using the search fields of the portal. The portal allows to search the BCOs by their BCO ID or by the BCO name.  Select one of the search options and enter the search value accordingly. Click on the ‘Search’ button to search the existing BCOs matching the entered BCO ID or BCO name.</Typography>
      <Typography variant='body1'>To view or edit the BCO retrieved by the search, click on the object from the search list displayed on the page.</Typography>
      
    </div>
  );
};

export default Icons;
