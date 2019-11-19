import React from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from "@material-ui/core/LinearProgress";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { AirtableData, getAirtableData } from "../../utils/airtable";

import { SensorData } from "./index";

import { RouteComponentProps, withRouter } from "react-router-dom";
import firebase from "../../firebase.js";

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  sensorId: string;
  sensorData: SensorData;
}

interface State {
  sensorId: string;
  sensorData: SensorData;
  airtableData?: AirtableData;
  logo?: File;
  logoPreviewSrc?: string | ArrayBuffer | null;
  sensorImage?: File;
  sensorImagePreviewSrc?: string | ArrayBuffer | null;
  logoUploadProgress: number;
  sensorImageUploadProgress: number;
}

class SensorForm extends React.Component<Props, State> {
  logoFileUpload: any = undefined;
  sensorFileUpload: any = undefined
  constructor(props: any) {
    super(props);
    this.state = {
      logoPreviewSrc: undefined,
      sensorImagePreviewSrc: undefined,
      sensorId: props.sensorId,
      logoUploadProgress: 101,
      sensorImageUploadProgress: 101,
      airtableData: undefined,
      sensorData: props.sensorData
    };
  }

  async componentDidMount() {
    const { sensorData } = this.props;
    const airtableData = await getAirtableData();
    this.setState({ airtableData });

    if (sensorData.sensorImageRef) {
      const storageRef = firebase.storage().ref();
      storageRef
        .child(sensorData.sensorImageRef)
        .getDownloadURL()
        .then(sensorImagePreviewSrc => {
          this.setState({ sensorImagePreviewSrc });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (sensorData.logoRef) {
      const storageRef = firebase.storage().ref();
      storageRef
        .child(sensorData.logoRef)
        .getDownloadURL()
        .then(logoPreviewSrc => {
          this.setState({ logoPreviewSrc });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  handleSensorDataChange(key: string, value: number | string) {
    this.setState(state => ({
      sensorData: { ...state.sensorData, [key]: value }
    }));
  }

  handleSubmit() {
    const { currentUser } = firebase.auth();
    var userId = currentUser && currentUser.uid;
    const { sensorId, sensorData } = this.state;

    if (userId && sensorId) {
      const updates: { [key: string]: any } = {};
      updates["/sensors/" + sensorId] = sensorData;
      if (sensorData.placeId) {
        updates[`places/${sensorData.placeId}/sensors/${sensorId}`] = true;
      }
      firebase
        .database()
        .ref()
        .update(updates, error => {
          if (error) {
            console.error(error);
          } else {
            this.props.history.push(`/sensors/${sensorId}`);
          }
        });
    } else {
      console.log("Unable to save. User not logged in");
    }
  }

  render() {
    const { classes } = this.props;
    const { airtableData, sensorId } = this.state;
    if (!airtableData) {
      return null;
    }
    const {
      techType,
      purpose,
      dataType,
      dataProcess,
      access,
      storage
    } = airtableData;

    return (
      <div className={classes.root}>
        <div className={classes.stepperContent}>
          <div>
            <Typography variant='h4' gutterBottom>Add Sensor Data</Typography>
            <div>
              <TextField
                className={this.props.classes.formField}
                label="Organization Name"
                value={this.state.sensorData.accountable}
                onChange={e => {
                  this.handleSensorDataChange("accountable", e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label="Organization Description"
                value={this.state.sensorData.accountableDescription}
                onChange={e => {
                  this.handleSensorDataChange(
                    "accountableDescription",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Purpose</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.purpose}
                  onChange={e => {
                    this.handleSensorDataChange("purpose", e.target.value);
                  }}
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
                  onChange={e => {
                    this.handleSensorDataChange("dataType", e.target.value);
                  }}
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
            {this.state.logoPreviewSrc &&
              typeof this.state.logoPreviewSrc === "string" && (
                <div>
                  <img
                    className={this.props.classes.imagePreview}
                    src={this.state.logoPreviewSrc}
                  />
                </div>
              )}
            {this.state.logoUploadProgress <= 100 && (
              <LinearProgress
                className={this.props.classes.imagePreview}
                variant="determinate"
                value={this.state.logoUploadProgress}
              />
            )}
            <div>
              <input
                accept="image/*"
                onChange={e => {
                  const logo = this.logoFileUpload.files[0];
                  if (logo) {
                    const fileExtension = logo.name.split(".").pop();
                    const logoRef = `images/${sensorId}/logo.${fileExtension}`;
                    const storageRef = firebase.storage().ref();
                    const uploadTask = storageRef.child(logoRef).put(logo);

                    uploadTask.on(
                      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                      snapshot => {
                        var logoUploadProgress =
                          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.setState({ logoUploadProgress });
                      },
                      error => console.log(error),
                      () => {
                        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                          this.handleSensorDataChange("logoRef", logoRef);
                          this.setState({
                            logoPreviewSrc: downloadURL,
                            logoUploadProgress: 101
                          });
                        });
                      }
                    );
                  }
                }}
                className={this.props.classes.input}
                id="logo-file"
                multiple
                ref={ref => (this.logoFileUpload = ref)}
                type="file"
              />
              <label htmlFor="logo-file">
                <Button
                  component="span"
                  variant="contained"
                  className={this.props.classes.formField}
                >
                  <CloudUploadIcon className={this.props.classes.leftIcon} />
                  Upload Organization Logo
            </Button>
              </label>
            </div>

            <div>
              <FormControl className={this.props.classes.formField}>
                <InputLabel htmlFor="select-multiple">Technology Type</InputLabel>
                <Select
                  multiple
                  value={this.state.sensorData.techType}
                  onChange={e => {
                    this.handleSensorDataChange("techType", e.target.value);
                  }}
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
                  onChange={e => {
                    this.handleSensorDataChange("access", e.target.value);
                  }}
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
                  onChange={e => {
                    this.handleSensorDataChange("storage", e.target.value);
                  }}
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
                  onChange={e => {
                    this.handleSensorDataChange("dataProcess", e.target.value);
                  }}
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

            <div>
              <TextField
                className={this.props.classes.formField}
                label="email"
                value={this.state.sensorData.email}
                onChange={e => {
                  this.handleSensorDataChange("email", e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label="phone"
                value={this.state.sensorData.phone}
                onChange={e => {
                  this.handleSensorDataChange("phone", e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label="chat"
                value={this.state.sensorData.chat}
                onChange={e => {
                  this.handleSensorDataChange("chat", e.target.value);
                }}
              />
            </div>

            <div>
              <TextField
                className={this.props.classes.formField}
                label="Sensor Name (will show on place page)"
                value={this.state.sensorData.name}
                onChange={e => {
                  this.handleSensorDataChange("name", e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label="Page Headline"
                value={this.state.sensorData.headline}
                onChange={e => {
                  this.handleSensorDataChange("headline", e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                className={this.props.classes.formField}
                label="Page Description"
                value={this.state.sensorData.description}
                multiline
                rowsMax="5"
                onChange={e => {
                  this.handleSensorDataChange("description", e.target.value);
                }}
              />
            </div>
            {this.state.sensorImagePreviewSrc &&
              typeof this.state.sensorImagePreviewSrc === "string" && (
                <div>
                  <img
                    className={this.props.classes.imagePreview}
                    src={this.state.sensorImagePreviewSrc}
                  />
                </div>
              )}
            {this.state.sensorImageUploadProgress <= 100 && (
              <LinearProgress
                className={this.props.classes.imagePreview}
                variant="determinate"
                value={this.state.sensorImageUploadProgress}
              />
            )}
            <div>
              <input
                accept="image/*"
                onChange={e => {
                  const sensorImage = this.sensorFileUpload.files[0];
                  if (sensorImage) {
                    const fileExtension = sensorImage.name.split(".").pop();
                    const sensorImageRef = `images/${sensorId}/sensorImage.${fileExtension}`;
                    const storageRef = firebase.storage().ref();
                    const uploadTask = storageRef
                      .child(sensorImageRef)
                      .put(sensorImage);

                    uploadTask.on(
                      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                      snapshot => {
                        const sensorImageUploadProgress =
                          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        this.setState({ sensorImageUploadProgress });
                      },
                      error => console.log(error),
                      () => {
                        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                          this.handleSensorDataChange(
                            "sensorImageRef",
                            sensorImageRef
                          );
                          this.setState({
                            sensorImagePreviewSrc: downloadURL,
                            sensorImageUploadProgress: 101
                          });
                        });
                      }
                    );
                  }
                }}
                className={this.props.classes.input}
                id="sensor-file"
                multiple
                ref={ref => (this.sensorFileUpload = ref)}
                type="file"
              />
              <label htmlFor="sensor-file">
                <Button
                  component="span"
                  variant="contained"
                  className={this.props.classes.formField}
                >
                  <CloudUploadIcon className={this.props.classes.leftIcon} />
                  Upload Image
               </Button>
              </label>
            </div>
          </div>
          <div>
            <Button
              color="primary"
              variant="contained"
              className={this.props.classes.formField}
              onClick={() => this.handleSubmit()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginBottom: "16px"
    },
    stepperContent: {
      padding: theme.spacing.unit * 3,
      paddingTop: 0
    },
    fabSave: {
      position: "fixed",
      bottom: "16px",
      width: "80px!important",
      marginLeft: "-40px",
      left: "50%"
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    actionsContainer: {
      marginBottom: theme.spacing.unit * 2
    },
    resetContainer: {
      padding: theme.spacing.unit * 3
    },
    formField: {
      width: "100%",
      maxWidth: "300px",
      marginTop: "16px",
      marginBottom: "8px"
    },
    imagePreview: {
      maxWidth: "300px",
      maxHeight: "300px",
      marginTop: "16px",
      marginBottom: "8px"
    },
    input: {
      display: "none"
    },
    leftIcon: {
      marginRight: theme.spacing.unit
    }
  });

export default withStyles(styles, { withTheme: true })(withRouter(SensorForm));
