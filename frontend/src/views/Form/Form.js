import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Button, colors, Modal, Collapse, List, FormControl, FormHelperText,
  ListItem, ListItemText, Tooltip, Typography
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useParams } from "react-router";
import MuiForm, { FieldTemplate } from 'rjsf-material-ui';
import schema from './NewSchema';
import uiSchema from './uiSchema';
import { getBcoById, updateBcoById, createBco, getNewObjectId } from 'service/bco';
import { getUserInfo } from 'service/user'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import { setFormChanged, getFormChanged, setInitial } from 'service/utils';
// import { KeyboardDateTimePicker } from '@material-ui/pickers'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  applyButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    },
    position: 'absolute',
    top: 0,
    right: 0,
  },
  applyButton1: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    },
    position: 'absolute',
    top: 0,
    right: 130,
  },
  paper: {
    position: 'absolute',
    width: '60%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1),
  },
  editor: {
    width: '100%'
  },
  itemTitle: {
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
  },
  fieldWrapper: {
    margin: '1em 0'
  }
}));

const log = (type) => console.log.bind(console, type);

function CustomFieldTemplate(props) {
  const classes = useStyles();
  // console.log(props);
  // if (props.schema.format === 'datetime') {
  //   let data = props.children[0].props;
  //   return (
  //     <div className={classes.fieldWrapper}>
  //       <FormControl disabled={props.disabled} fullWidth={true} required={props.required}>
  //         <KeyboardDateTimePicker
  //           {...data}
  //           disableToolbar
  //           variant="inline"
  //           margin="normal"
  //           id={props.id}
  //           label={data.name}
  //           value={data.formData}            
  //           KeyboardButtonProps={{
  //             'aria-label': 'change date',
  //           }}
  //         />
  //         <FormHelperText id={`${props.id}-helper`}>{props.schema.description}</FormHelperText>
  //       </FormControl>
  //     </div>
  //   )
  // }
  // if (props.schema.format === 'email') {
  //   let data = props.children[0].props;

  //   return (
  //     <div className={classes.fieldWrapper}>
  //       <FormControl disabled={data.disabled} fullWidth={true} required={data.required}>
  //         <InputLabel htmlFor={props.id}>{data.name}</InputLabel>
  //         <Input {...data} type={'email'} id={props.id} aria-describedby={`${props.id}-helper`} value={data.formData} />
  //         <FormHelperText id={`${props.id}-helper`}>{props.schema.description}</FormHelperText>
  //       </FormControl>
  //     </div>
  //   )
  // }

  return (
    <div className={classes.fieldWrapper}>
      <FieldTemplate {...props} />
    </div>
  )
}

/**/
function ObjectFieldTemplate(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.objectField}>
      <ListItem button onClick={handleClick} className={classes.titleBar}>
        <ListItemText className={classes.itemTitle}>
          {props.title && props.title.includes('BioCompute') ? <h1>{props.title}</h1> :
            props.title && props.title.includes('Domain') ? <h2>{props.title.includes('Error') ? props.title : props.title + ' *'}</h2> : <h4>{props.title}</h4>}
          {props.title && <Tooltip title={props.description || ''} placement="right-start">
            <InfoIcon />
          </Tooltip>}
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.properties.map(element => <div className="property-wrapper">{element.content}</div>)}
        {props.patternProperties && props.additionalProperties ?
           <div className="property-wrapper">{props.content}</div>
          : ''}
      </Collapse>
    </div>
  );
}
/**/
const FormView = (props) => {
  const [data, setData] = useState({});
  const [text, setText] = useState('');
  const [objectId, setObjectId] = useState('');
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useHistory();
  let { id } = useParams();

  const classes = useStyles();

  const onGotoBackUrl = () => {
    setFormChanged(1)
    if (id && id !== 'new') {
      router.push('/detail/' + id)
    } else {
      router.push('/dashboard');
    }
  }

  useEffect(() => {
    setInitial()
    async function fetchData() {
      if (id && id !== 'new') {
        props.updateLoading(true);
        let result = await getBcoById(id);
        if (result.status === 200) {
          let _data = result.result;
          delete _data.id;
          setObjectId(_data.object_id);
          setData(validInputJson(_data));
          setText(JSON.stringify(_data, null, 4));
        }
        props.updateLoading(false);
      } else {
        // window.open('/sample/bco', "_blank", 'location=yes,height=768,width=1024,scrollbars=yes,status=yes');
        let newId = await getNewObjectId();
        let _data = {
          object_id: newId.result.object_id,
          spec_version: '1.4.0',
          provenance_domain: {
            embargo: {},
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
          },
          etag: -1,
          extension_domain: [],
          description_domain: {},
          execution_domain: {
            environment_variables: {}
          },
          io_domain: {}
        };

        setObjectId(_data.object_id);
        setData(validInputJson(_data));
        setText(JSON.stringify(_data, null, 4));
      }

      setTimeout(() => setLoaded(true), 2000);
    }
    fetchData();
  }, []);

  useEffect(() => {
    (function(global) {
      var _hash = "!", loaded = false;

      if (typeof (global) === "undefined") {
        throw new Error("window is undefined");
      }

      var noBackPlease = function() {
        if (!global.location.href.includes('#')) {
          global.location.href += "#";
          // making sure we have the fruit available for juice....
          // 50 milliseconds for just once do not cost much (^__^)          
        } else {
          global.location.href = global.location.href.split('#')[0] + '#';
        }
        global.setTimeout(function() {
          if (!global.location.href.includes('!')) {
            global.location.href += "!";
            loaded = true
          }
        }, 50);
      };

      setTimeout(() => {
        // Earlier we had setInerval here....
        global.onhashchange = function() {
          if (getFormChanged() === '0' && loaded) {
            return onGotoBackUrl();
          }
          if (getFormChanged() === '1' && loaded && (!global.location.hash || (global.location.hash.split('!').length / 2) === 0)) {
            // console.log(global.location.hash)
            if (global.location.hash !== _hash) {
              let result = window.confirm("If you navigate away from this page you will lose your unsaved changes.");
              if (result) {
                return onGotoBackUrl();
              }
              global.location.hash = _hash;
            }
          }
        };
      }, 2000)

      noBackPlease();
    })(window);
  }, [])

  const onSave = async (event, value) => {
    let user = getUserInfo();
    let { formData } = event;
    props.updateLoading(true);

    formData.object_id = objectId;
    formData = validOutputJson(formData);
    let result = {};
    if (id !== 'new') {
      formData.provenance_domain.modified = new Date().toISOString();
      result = await updateBcoById(formData, id);
    } else {
      formData.provenance_domain.created = new Date().toISOString();
      formData.provenance_domain.modified = new Date().toISOString();
      let contributors = formData.provenance_domain.contributors.filter(item => item.email === user.email)

      if (!contributors.length) {
        formData.provenance_domain.contributors.push({
          affiliation: "Creator",
          contribution: [
            "createdBy"
          ],
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          orcid: ""
        })
      } else {
        formData.provenance_domain.contributors.map(item => {
          if (item.email === user.email) {
            return { ...item, "contribution": ["createdBy"] }
          }
          return item
        })
      }
      result = await createBco(formData);
    }
    props.updateLoading(false);
    if (result.status >= 400) {
      props.setAlertData({ type: 'error', message: result.result });
      props.setOpenAlert(true);
    } else {
      router.push('/dashboard');        
    }
  }

  const onError = error => {
    console.log(error);
  }

  const onDataChange = (event) => {
    setText(event.target.value);
  }

  const onSaveText = () => {
    try {
      JSON.parse(text)
      handleClose();
      let data = JSON.parse(text);
      setData(validInputJson(data));
    } catch (err) {
      props.setAlertData({ type: 'error', message: 'Error in parsing JSON.' });
      props.setOpenAlert(true);
    }
  }

  const validInputJson = (data) => {
    delete data['id'];
    delete data['checksum'];

    if (id === 'new') {
      data['etag'] = 'new';
    }

    if (data.execution_domain.environment_variables) {
      if (JSON.stringify(data.execution_domain.environment_variables) === '{}') {
        data.execution_domain.environment_variables = [];
      } else if (!Array.isArray(data.execution_domain.environment_variables)) {
        let new_env = Object.keys(data.execution_domain.environment_variables).map(key => ({key: key, value: data.execution_domain.environment_variables[key]}))
        data.execution_domain.environment_variables = new_env;
      }
    }

    if (data.error_domain && typeof data.error_domain.empirical_error === 'object') {
      data.error_domain.empirical_error = JSON.stringify(data.error_domain.empirical_error, null, 4);
    }

    if (data.error_domain && typeof data.error_domain.algorithmic_error === 'object') {
      data.error_domain.algorithmic_error = JSON.stringify(data.error_domain.algorithmic_error, null, 4);
    }

    return data;
  }

  const validOutputJson = (data) => {
    delete data['id'];
    delete data['checksum'];
    data.error_domain.empirical_error = JSON.parse(data.error_domain.empirical_error || '{}');
    data.error_domain.algorithmic_error = JSON.parse(data.error_domain.algorithmic_error || '{}');
    return data;
  }

  const onFormChange = (event) => {
    if (!loaded) return;

    let newFormData = JSON.parse(JSON.stringify(event.formData));
    let newData = JSON.parse(JSON.stringify(data));
    delete newFormData['object_id'];
    delete newData['object_id'];
    delete newData['checksum'];
    delete newData['etag'];
    if (newFormData === newData)
      return

    setData(event.formData);
    setFormChanged(1);
    if (getFormChanged() === '1')
      window.onbeforeunload = function() { return "If you navigate away from this page you will lose your unsaved changes."; };
  }

  const openModal = () => { setOpen(true); setText(JSON.stringify(data, null, 4)) }
  const handleClose = () => setOpen(false)

  const validateForm = (formData, errors) => {
    if (formData.error_domain.empirical_error 
      && !IsJsonString(formData.error_domain.empirical_error)) {
      errors.error_domain.empirical_error.addError('Empirical Error should be valid JSON string.')
    }

    if (formData.error_domain.algorithmic_error 
      && !IsJsonString(formData.error_domain.empirical_error)) {
      errors.error_domain.algorithmic_error.addError('Algorithmic Error should be valid JSON string.')
    }

    return errors;
  }

  const IsJsonString = (str) => {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

	return (
    <div className={'form-schema'}>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <textarea className={classes.editor} rows={30} value={text} onChange={onDataChange} />
          <Button
            color="primary"
            variant="contained"
            onClick={onSaveText}
          >
            Save
          </Button>
        </div>
      </Modal>
			<MuiForm schema={schema}
        uiSchema={uiSchema}
        formData={data}
				onChange={onFormChange}
				onSubmit={onSave}
				onError={onError}
        FieldTemplate={CustomFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        validate={validateForm}>
        <Button
          className={classes.applyButton}
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
        <Button
          className={classes.applyButton1}
          variant="contained"
          onClick={openModal}
        >
          Edit JSON
        </Button>
      </MuiForm>
		</div>
	);
};

export default FormView;
