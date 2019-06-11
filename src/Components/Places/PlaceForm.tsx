import React from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LocationPicker from '../LocationPicker';
import * as MapboxGL from 'mapbox-gl';

import firebase from '../../firebase.js';
import { PlaceData } from '../Places'

interface PlaceFormProps extends PlaceData, WithStyles<typeof styles> {
  id: string;
  title: string;
  onSave(id: string): void;
}

class PlaceForm extends React.Component<PlaceFormProps, PlaceData> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: props.name,
      lngLat: props.lngLat,
      sensors: props.sensors,
      admins: props.admins,
    };
  }

  handleSubmit() {
    const user = firebase.auth().currentUser
    const { id } = this.props
    if (id && user) {
      const { uid } = user
      const { name, lngLat, sensors, admins } = this.state
      const newPlaceData: PlaceData = { name, lngLat, sensors, admins: { ...admins, [uid]: true } }
      const updates: { [key: string]: any } = {};
      updates['/places/' + id] = newPlaceData;
      updates[`users/${uid}/places/${id}`] = true;
      firebase.database().ref().update(updates, (error) => {
        if (error) {
          console.error(error)
        } else {
          this.props.onSave(id);
        }
      });
    } else {
      console.log("Unable to save. User not logged in")
    }
  }

  render() {
    const { classes, title } = this.props
    const { name, lngLat } = this.state
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
        <TextField
          id="name"
          label="Place Name"
          value={name}
          onChange={(e) => { this.setState({ name: e.target.value }) }}
        />
        <div className={classes.locationPicker}>
          <LocationPicker
            onSelectLocation={(lngLat: MapboxGL.LngLat) => this.setState({ lngLat })}
            markerLocation={Object.values(lngLat)}
          />
        </div>
        <Button onClick={() => this.handleSubmit()}>Save</Button>
      </div>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'calc(100% - 167px)',
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 4,
    },
  },
  locationPicker: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: '100%',
    height: '500px'
  }
});

export default withStyles(styles, { withTheme: true })(PlaceForm);