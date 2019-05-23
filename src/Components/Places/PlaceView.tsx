import React, { Component } from 'react';
import firebase from '../../firebase.js';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import SensorForm from '../Sensors/SensorForm'

import LocationPicker from '../LocationPicker';
import * as MapboxGL from 'mapbox-gl';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      maxWidth: theme.breakpoints.values.md,
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 4,
    },
  },
  cardActionArea: {
    minHeight: '50px',
  },
  addSensorButton: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationPicker: {
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
    height: '200px'
  }
});

class PlaceView extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      place: {},
      displayForm: false,
    };
  }

  componentDidMount() {
    const { placeId } = this.props.match.params
    const placesRef = firebase.database().ref(`places/${placeId}`);
    placesRef.on('value', (snapshot) => {
      if (snapshot) {
        let place = snapshot.val();
        this.setState({
          place
        });
      }
    });
  }

  render() {
    const { classes } = this.props
    const { placeId } = this.props.match.params
    const { name, lngLat, sensors = {} } = this.state.place
    const markerLocation = lngLat ? Object.values(lngLat).reverse() : undefined

    // TODO: fix this logic
    const userHasAccess = !!this.props.uid
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h4" component="h2">{name}</Typography>
        <div className={classes.locationPicker}>
          {lngLat && <LocationPicker
            onSelectLocation={(lngLat: MapboxGL.LngLat) => { }}
            markerLocation={markerLocation}
            center={markerLocation}
          />}
        </div>
        <Grid container spacing={24}>
          {Object.keys(sensors).map((id) => {
            return (
              <Grid key={id} item xs={12}>
                <Card className={classes.card}>
                  <CardActionArea className={classes.cardActionArea} href={`/sensors/${id}`}>
                    <CardContent>
                      <Typography gutterBottom variant="subtitle1" component="h2">
                        {sensors[id]}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
          {userHasAccess && !this.state.displayForm && <Grid item xs={12}>
            <Card className={classes.card}>
              <CardActionArea className={classes.cardActionArea} onClick={() => { this.setState({ displayForm: true }) }}>
                <CardContent className={classes.addSensorButton}>
                  <AddIcon fontSize='large' color='primary' />
                  <Typography color='primary' gutterBottom variant="subtitle2" component="h2">
                    Add a Sensor
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>}
          {this.state.displayForm && <Grid item xs={12}>
            <Card className={classes.card}>
              <SensorForm placeId={placeId} />
            </Card>
          </Grid>}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PlaceView);
