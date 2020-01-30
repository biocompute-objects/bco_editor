import React from 'react';

import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Remove from '@material-ui/icons/Remove';

const mappings = {
  remove: <Remove />,
  plus: <Add />,
  'arrow-up': <ArrowUpward />,
  'arrow-down': <ArrowDownward />,
};

const IconButton = (props) => {
  const { icon, className, ...otherProps } = props;
  return (
    <Button {...otherProps} size="small">
      {mappings[icon]}
    </Button>
  );
};

export default IconButton;