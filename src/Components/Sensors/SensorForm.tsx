import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import uuid from "uuid";
import MenuItem from '@material-ui/core/MenuItem';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { AirtableData, getAirtableData } from '../../utils/airtable'

import { SensorData } from './index'

import { withRouter } from 'react-router-dom'
import firebase from '../../firebase.js';

interface State {
  activeStep: number,
  sensorData: SensorData,
  airtableData?: AirtableData,
  logo?: File,
  logoPreviewSrc?: string | ArrayBuffer | null,
  sensorImage?: File,
  sensorImagePreviewSrc?: string | ArrayBuffer | null,
}

class SensorForm extends React.Component<any, State> {
  logoFileUpload: any = undefined
  constructor(props: any) {
    super(props);

    this.state = {
      activeStep: 0,
      logoPreviewSrc: undefined,
      sensorData: {
        name: '',
        placeId: props.placeId,
        headline: '',
        description: '',
        accountable: '',
        accountableDescription: '',
        purpose: [],
        techType: [],
        dataType: [],
        dataProcess: [],
        access: [],
        storage: [],
        phone: '',
        chat: '',
        email: '',
        onsiteStaff: '',
        logoRef: '',
        sensorImageRef: '',
      },
      airtableData: undefined,
    };
  }

  async componentDidMount() {
    const airtableData = await getAirtableData()
    this.setState({ airtableData })
  }

  getSteps() {
    return [
      'The Basics',
      'Data Use',
      'Contact Details',
      'Extras',
    ]
  }

  getStepContent(step: number) {
    const { airtableData } = this.state
    if (!airtableData) {
      return null
    }
    const { techType, purpose, dataType, dataProcess, access, storage } = airtableData

    switch (step) {
      case 0:
        return (
          <div>
            <Typography variant="h6" gutterBottom>The Basics</Typography>
            <Typography variant="body1" gutterBottom>Add top-level information the guide which stickers to use.</Typography>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='Organization Name'
                value={this.state.sensorData.accountable}
                onChange={(e) => { this.handleChange('accountable', e.target.value) }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='Organization Description'
                value={this.state.sensorData.accountableDescription}
                onChange={(e) => { this.handleChange('accountableDescription', e.target.value) }}
              />
            </div>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Purpose</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.purpose}
                  onChange={(e) => { this.handleChange('purpose', e.target.value) }}
                  input={<Input id="select-multiple" />}
                >
                  {purpose.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Data Type</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.dataType}
                  onChange={(e) => { this.handleChange('dataType', e.target.value) }}
                  input={<Input id="select-multiple" />}
                >
                  {dataType.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {this.state.logoPreviewSrc && typeof this.state.logoPreviewSrc === 'string' && <div>
              <img className={this.props.classes.imagePreview} src={this.state.logoPreviewSrc}></img>
            </div>}
            <div>
              <input
                accept="image/*"
                onChange={(e) => {
                  const file = this.logoFileUpload.files[0];
                  this.setState({ logo: file })
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const logoPreviewSrc = reader.result;
                      this.setState({ logoPreviewSrc })
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={this.props.classes.input}
                id="raised-button-file"
                multiple
                ref={(ref) => this.logoFileUpload = ref}
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button component="span" variant='contained' className={this.props.classes.formField}>
                  <CloudUploadIcon className={this.props.classes.leftIcon} />
                  Upload Organization Logo
                </Button>
              </label>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            <Typography variant="h6" gutterBottom>Data Use</Typography>
            <Typography variant="body1" gutterBottom>If data is being collected, describe how it is being used</Typography>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Technology Type</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.techType}
                  onChange={(e) => { this.handleChange('techType', e.target.value) }}
                  input={<Input id="select-multiple" />}
                >
                  {techType.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Access</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.access}
                  onChange={(e) => { this.handleChange('access', e.target.value) }}
                  input={<Input id="select-multiple" />}
                >
                  {access.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Data Storage</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.storage}
                  onChange={(e) => { this.handleChange('storage', e.target.value) }}
                  input={<Input id="select-multiple" />}
                >
                  {storage.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Data Processing</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.dataProcess}
                  onChange={(e) => { this.handleChange('dataProcess', e.target.value) }}
                  input={<Input id="select-multiple" />}
                >
                  {dataProcess.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <Typography variant="h6" gutterBottom>Contact info</Typography>
            <Typography variant="body1" gutterBottom>Add details about who people can contact with questions</Typography>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='email'
                value={this.state.sensorData.email}
                onChange={(e) => { this.handleChange('email', e.target.value) }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='phone'
                value={this.state.sensorData.phone}
                onChange={(e) => { this.handleChange('phone', e.target.value) }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='chat'
                value={this.state.sensorData.chat}
                onChange={(e) => { this.handleChange('chat', e.target.value) }}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <Typography variant="h6" gutterBottom>The Extras</Typography>
            <Typography variant="body1" gutterBottom>Add information for visitors to the webpage</Typography>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='Sensor Name (will show on place page)'
                value={this.state.sensorData.name}
                onChange={(e) => { this.handleChange('name', e.target.value) }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='Page Headline'
                value={this.state.sensorData.headline}
                onChange={(e) => { this.handleChange('headline', e.target.value) }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label='Page Description'
                value={this.state.sensorData.description}
                multiline
                rowsMax="5"
                onChange={(e) => { this.handleChange('description', e.target.value) }}
              />
            </div>
            {this.state.sensorImagePreviewSrc && typeof this.state.sensorImagePreviewSrc === 'string' && <div>
              <img className={this.props.classes.imagePreview} src={this.state.sensorImagePreviewSrc}></img>
            </div>}
            <div>
              <input
                accept="image/*"
                onChange={(e) => {
                  const file = this.logoFileUpload.files[0];
                  this.setState({ sensorImage: file })
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const sensorImagePreviewSrc = reader.result;
                      this.setState({ sensorImagePreviewSrc })
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={this.props.classes.input}
                id="raised-button-file"
                multiple
                ref={(ref) => this.logoFileUpload = ref}
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button component="span" variant='contained' className={this.props.classes.formField}>
                  <CloudUploadIcon className={this.props.classes.leftIcon} />
                  Upload Image
                </Button>
              </label>
            </div>
          </div>
        )
      default:
        return null;
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleChange(key: string, value: number | string) {
    this.setState(state => ({
      sensorData: { ...state.sensorData, [key]: value },
    }));
  }

  handleSubmit() {
    const { currentUser } = firebase.auth()
    var userId = currentUser && currentUser.uid;
    if (userId) {
      const sensorId = uuid.v4()
      const { sensorData, logo, sensorImage } = this.state
      let logoRef = null
      let sensorImageRef = null

      if (logo) {
        const fileExtension = logo.name.split('.').pop();
        logoRef = `images/${sensorId}/logo.${fileExtension}`
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(logoRef).put(logo);
      }

      if (sensorImage) {
        const fileExtension = sensorImage.name.split('.').pop();
        sensorImageRef = `images/${sensorId}/sensorImage.${fileExtension}`
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(sensorImageRef).put(sensorImage);
      }

      firebase.database().ref(`sensors/${sensorId}`).set({ ...sensorData, logoRef, sensorImageRef, uid: userId });

      if (sensorData.placeId) {
        firebase.database().ref(`places/${sensorData.placeId}/sensors/${sensorId}`).set(sensorData.name || '');
      }
      this.props.history.push(`/sensors/${sensorId}`)
    } else {
      console.log("Unable to save. User not logged in")
    }
  }

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={classes.stepperContent}>
          {this.getStepContent(activeStep)}
          <div className={classes.actionsContainer}>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => activeStep === steps.length - 1 ? this.handleSubmit() : this.handleNext()}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  root: {

  },
  stepperContent: {
    padding: theme.spacing.unit * 3,
    paddingTop: 0,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  formField: {
    width: '100%',
    maxWidth: '300px',
    marginTop: '16px',
    marginBottom: '8px'
  },
  imagePreview: {
    maxWidth: '300px',
    maxHeight: '300px',
    marginTop: '16px',
    marginBottom: '8px'
  },
  input: {
    display: 'none',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles, { withTheme: true })(withRouter(SensorForm));