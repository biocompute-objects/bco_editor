import React from 'react';

import {
  isMultiSelect,
  getDefaultRegistry,
} from 'react-jsonschema-form/lib/utils';
import { makeStyles } from '@material-ui/styles';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

import AddButton from './AddButton';
import IconButton from './IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  itemTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    '&> span': {
      display: 'flex',
      '&> h2': {
        marginRight: theme.spacing(1),
        fontWeight: 500
      },
      '&> h4': {
        marginRight: theme.spacing(1),
        fontWeight: 500
      }
    }
  },
  titleBar: {
    padding: '1em 0'
  },
  objectField: {
    border: '1px solid #e3e3e3',
    padding: '1em',
    margin: '1em 0'
  }
}))

const ArrayFieldTemplate = (props ) => {
  const { schema, registry = getDefaultRegistry() } = props;

  if (isMultiSelect(schema, registry.definitions)) {
    return <DefaultFixedArrayFieldTemplate {...props} />;
  } else {
    return <DefaultNormalArrayFieldTemplate {...props} />;
  }
};


const ArrayFieldTitle = ({
  TitleField,
  idSchema,
  title,
  required,
  description,
  onClick,
  open
}) => {
  const classes = useStyles();
  if (!title) {
    return <div />;
  }
  
  const id = `${idSchema.$id}__title`;
  return ( <div id={id} className={classes.titleBar} onClick={onClick}>
    <div className={classes.itemTitle}>
      <Typography variant={'body1'} variantMapping={{body1: 'span'}}>
        {title.includes('Domain') ? <h2>{title}</h2> : <h4>{title}</h4>}
        <Tooltip title={description} placement="right-start">
          <InfoIcon />
        </Tooltip>
      </Typography>
      {open ? <ExpandLess /> : <ExpandMore />}
    </div>
  </div> )
};


// Used in the two templates
const DefaultArrayItem = (props) => {
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
  };
  return (
    <Grid container={true} key={props.index} alignItems="center">
      <Grid item={true} xs>
        <Box mb={2}>
          <Paper elevation={2}>
            <Box p={2}>{props.children}</Box>
          </Paper>
        </Box>
      </Grid>

      {props.hasToolbar && (
        <Grid item={true}>
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              icon="arrow-up"
              className="array-item-move-up"
              tabIndex={-1}
              style={btnStyle}
              disabled={props.disabled || props.readonly || !props.hasMoveUp}
              onClick={props.onReorderClick(props.index, props.index - 1)}
            />
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              icon="arrow-down"
              tabIndex={-1}
              style={btnStyle}
              disabled={props.disabled || props.readonly || !props.hasMoveDown}
              onClick={props.onReorderClick(props.index, props.index + 1)}
            />
          )}

          {props.hasRemove && (
            <Button 
              tabIndex={-1}
              disabled={props.disabled || props.readonly}
              onClick={props.onDropIndexClick(props.index)}
              variant="outlined"
            >Delete</Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

const DefaultFixedArrayFieldTemplate = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema['ui:title'] || props.title}
        required={props.required}
        description={props.uiSchema['ui:description'] || props.schema.description}
        onClick={handleClick}
        open={open}
      />

      <Collapse in={open} timeout="auto" unmountOnExit>
        <div
          className="row array-item-list"
          key={`array-item-list-${props.idSchema.$id}`}
        >
          {props.items && props.items.map(DefaultArrayItem)}
        </div>

        {props.canAdd && (
          <AddButton
            className="array-item-add"
            onClick={props.onAddClick}
            disabled={props.disabled || props.readonly}
            label={props.uiSchema.buttonLabel}
          />
        )}
      </Collapse>
    </fieldset>
  );
};

const DefaultNormalArrayFieldTemplate = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Paper elevation={2}>
      <Box p={2}>
        <ArrayFieldTitle
          onClick={handleClick}
          key={`array-field-title-${props.idSchema.$id}`}
          TitleField={props.TitleField}
          idSchema={props.idSchema}
          title={props.uiSchema['ui:title'] || props.title}
          required={props.required}
          description={props.uiSchema['ui:description'] || props.schema.description}
          open={open}
        />
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Grid container={true} key={`array-item-list-${props.idSchema.$id}`}>
            {props.items && props.items.map(p => DefaultArrayItem(p))}

            {props.canAdd && (
              <Grid container justify="flex-end">
                <Grid item={true}>
                  <Box mt={2}>
                    <AddButton
                      className="array-item-add"
                      onClick={props.onAddClick}
                      disabled={props.disabled || props.readonly}
                      {...(props.uiSchema['ui:options'] && {
                        label: props.uiSchema['ui:options'][
                          'addButtonLabel'
                        ],
                      })}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default ArrayFieldTemplate;