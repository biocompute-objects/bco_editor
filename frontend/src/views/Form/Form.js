import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, colors, Modal } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useParams} from "react-router";
import MuiForm from 'rjsf-material-ui';
import Form from "react-jsonschema-form";
import schema from './schema';
import { getBcoById, updateBcoById, createBco } from 'service/bco';
import { getUserInfo } from 'service/user'

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

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
  }
}));

const log = (type) => console.log.bind(console, type);

const FormView = (props) => {
  const [ data, setData ] = useState({});
  const [ text, setText ] = useState('');
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const router = useHistory();
  let { id } = useParams();

  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      if (id && id !== 'new') {
        props.updateLoading(true);
        let result = await getBcoById(id);
        if (result.status === 200) {
          let _data = result.result;
          delete _data.id;
          setData(_data);
          setText(JSON.stringify(_data,null, 4));
        }
        props.updateLoading(false);
      }
    }
    fetchData();
  }, []);

  const onSave = async (event, value) => {
    let user = getUserInfo();
    let { formData } = event;
    props.updateLoading(true);
    if(id !== 'new') {
      await updateBcoById(formData, id);
    } else {
      let contributors = formData.provenance_domain.contributors.filter(item => item.email === user.email)

      if (!contributors.length) {
         formData.provenance_domain.contributors.push({
            "affiliation": "Creator",
            "contribution": [
                "createdBy"
            ],
            "email": user.email,
            "name": `${user.first_name} ${user.last_name}`,
            "orcid": ""
        })        
      } else {
        formData.provenance_domain.contributors.map(item => {
          if (item.email === user.email) {
            return {...item, "contribution": ["createdBy"]}
          }
          return item
        })
      }
      await createBco(formData);
    }
    props.updateLoading(false);
    router.push('/dashboard');
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
      setData(JSON.parse(text));
    } catch (err) {
      props.setAlertData({ type: 'error', message: 'Error in parsing JSON.'});
      props.setOpenAlert(true);
    }
  }

  const openModal = () => {setOpen(true); setText(JSON.stringify(data, null, 4))}
  const handleClose = () => setOpen(false)

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
        formData={data}
				onChange={log("changed")}
				onSubmit={onSave}
				onError={onError}>
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