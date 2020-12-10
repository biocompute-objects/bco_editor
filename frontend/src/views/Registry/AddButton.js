  
import React from 'react';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

// TODO: Add label property on type definition
const AddButton = props => (
  <Button {...props} color="secondary">
    <AddIcon /> {props.label || 'Add Item'}
  </Button>
);

export default AddButton;