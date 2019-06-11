import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import firebase from '../../firebase.js';
import { AirtableData, getAirtableData } from '../../utils/airtable'
import StaticMap from '../StaticMap';
import { PlaceData } from '../Places'
import { SensorData } from '../Sensors'
import CreateSensorForm from '../Sensors/CreateSensorForm'

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
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  cardIcon: {
    marginBottom: theme.spacing.unit
  },
  addSensorButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: '50%',
    transform: 'translateX(50%)'
  },
  addIcon: {
    marginRight: theme.spacing.unit,
  },
  staticMap: {
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
    height: '200px'
  }
});

interface PlaceViewState {
  isLoading: boolean,
  place?: PlaceData,
  sensorDataList?: { [sensorId: string]: SensorData },
  airtableData?: AirtableData;
  displayForm: boolean,
}

class PlaceView extends Component<any, PlaceViewState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      place: undefined,
      sensorDataList: undefined,
      airtableData: undefined,
      displayForm: false,
    };
  }

  async componentDidMount() {
    const { placeId } = this.props.match.params
    const placesRef = firebase.database().ref(`places/${placeId}`);
    placesRef.once('value', (snapshot) => {
      if (snapshot) {
        let place: PlaceData | null = snapshot.val() || {};

        if (place) {
          this.setState({
            place,
            isLoading: false,
          });
        }

        if (place && place.sensors) {
          const sensorIds = Object.keys(place.sensors);
          const promises = sensorIds.map(
            sensorId => firebase.database().ref(`/sensors/${sensorId}`).once('value')
          );

          let sensorDataList: { [sensorId: string]: SensorData } = {};
          Promise.all(promises).then(results => {
            results.forEach(result => {
              const id = result.key
              const sensor: SensorData | null = result.val()
              if (id && sensor) {
                sensorDataList[id] = sensor
              }
            });
            this.setState({
              sensorDataList
            });
          });
        }
      }
    });

    // load airtable data last so screen can render and it feels faster
    const airtableData = await getAirtableData();
    this.setState({ airtableData })
  }

  render() {
    const { classes } = this.props
    const { placeId } = this.props.match.params
    const { isLoading, place, airtableData, sensorDataList } = this.state

    if (isLoading) return <LinearProgress color="secondary" />
    if (!place) return <Typography>Hmm can't seem to find that place :/</Typography>

    const { name, lngLat = {} } = place
    const markerLocation = lngLat ? Object.values(lngLat).reverse() : undefined

    const currentUser = firebase.auth().currentUser
    const userHasAccess = currentUser && place.admins && place.admins[currentUser.uid]
    return (
      <div className={classes.root}>
        <div>
          <Typography gutterBottom variant="h4" component="h2">{name}&nbsp;
            {userHasAccess && <IconButton href={`/places/${placeId}/edit`} aria-label="Edit">
              <EditIcon />
            </IconButton>}
          </Typography>
        </div>
        <div className={classes.staticMap}>
          {lngLat && <StaticMap
            markerLocation={markerLocation}
            center={markerLocation}
          />}
        </div>
        <Grid container spacing={16}>
          {sensorDataList && Object.keys(sensorDataList).map((id) => {
            const sensor = sensorDataList[id]
            const { name, purpose } = sensor
            const featuredPurpose = purpose && purpose.length ? purpose[0] : undefined
            let icon: string | null = null
            if (featuredPurpose && airtableData) {
              const config = airtableData.purpose.find((option) => option.name === featuredPurpose)
              if (config) icon = `/images/${config.iconShortname}.svg`
            }
            return (
              <Grid key={id} item xs={4} sm={3}>
                <Card className={classes.card} elevation={0}>
                  <CardActionArea className={classes.cardActionArea} href={`/sensors/${id}`}>
                    <CardContent className={classes.cardContent}>
                      {icon && <img className={classes.cardIcon} src={icon} />}
                      <Typography variant="body2" align='center'>
                        {name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
          {userHasAccess && !this.state.displayForm && <Fab
            variant="extended"
            aria-label="Add"
            className={classes.addSensorButton}
            color='primary'
            onClick={() => { this.setState({ displayForm: true }) }}
          >
            <AddIcon className={classes.addIcon} />
            Add
          </Fab>}
          {this.state.displayForm && <Grid item xs={12}>
            <Card className={classes.card}>
              <CreateSensorForm placeId={placeId} />
            </Card>
          </Grid>}
        </Grid>
      </div >
    );
  }
}

export default withStyles(styles)(PlaceView);
