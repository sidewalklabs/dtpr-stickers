import React from 'react';
import uuid from "uuid";
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LocationPicker from '../LocationPicker';
import * as MapboxGL from 'mapbox-gl';

import { withRouter } from 'react-router-dom'
import firebase from '../../firebase.js';

class PlaceForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      id: '',
      name: '',
      lngLat: { lat: 40.917684, lng: -74.293952 },
      sensors: [],
    };
  }

  async componentDidMount() {
    const { uid } = this.props
    const { placeId } = this.props.match.params
    if (placeId) {
      const placeRef = firebase.database().ref(`places/${placeId}`)

      placeRef.on('value', (snapshot) => {
        if (snapshot) {
          const item = snapshot.val();
          const { name, lngLat, sensors } = item
          this.setState({ name, lngLat, sensors, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
    } else {
      this.setState({ id: uuid.v4(), uid, loading: false })
    }
  }

  handleChange(key: string, value: number | string, name: string) {
    this.setState({
      [key]: value,
    })
  }

  handleSubmit() {
    const { uid } = this.props
    if (uid) {
      const { id, name, lngLat, sensors } = this.state
      firebase.database().ref(`places/${id}`).set({
        name, lngLat, sensors
      });
      firebase.database().ref(`users/${uid}/places/${id}`).set(name);
      this.props.history.push(`/places/${id}`)
    } else {
      console.log("Unable to save. User not logged in")
    }
  }

  render() {
    const { classes } = this.props
    const { name, lngLat } = this.state
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h5" component="h2">Create a New Place</Typography>
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

export default withStyles(styles, { withTheme: true })(withRouter(PlaceForm));