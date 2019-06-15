import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createStyles, withStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import firebase from "../../firebase.js";
import { AirtableData, getAirtableData } from "../../utils/airtable";
import StaticMap from "../StaticMap";
import { PlaceData } from "../Places";
import { SensorData } from "../Sensors";
import CreateSensorForm from "../Sensors/CreateSensorForm";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: "auto",
      padding: theme.spacing.unit * 2,
      [theme.breakpoints.up("md")]: {
        maxWidth: theme.breakpoints.values.md,
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4
      }
    },
    headerRow: {
      margin: "8px -16px 16px -16px",
      padding: "0 16px 16px 16px",
      borderBottom: "0.5px solid rgba(0,0,0,0.15)"
    },
    title: {
      fontSize: "20px",
      fontWeight: "bolder"
    },
    subtitle: {
      fontSize: "14px",
      color: "rgba(0,0,0,.6)",
      fontWeight: 500
    },
    tabBar: {
      margin: "0 -16px",
      borderBottom: "0.5px solid rgba(0,0,0,0.15)"
    },
    singleTab: {
      textTransform: "none"
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "8px 0 0 0"
    },
    cardIcon: {
      margin: "16px 0 8px 0",
      width: "56px",
      height: "56px",
      opacity: 0.7
    },
    cardIconText: {
      fontSize: "12px",
      lineHeight: "16px",
      fontWeight: 500
    },
    addSensorButton: {
      position: "fixed",
      bottom: theme.spacing.unit * 2,
      right: "50%",
      transform: "translateX(50%)"
    },
    addIcon: {
      marginRight: theme.spacing.unit
    },
    staticMap: {
      marginBottom: theme.spacing.unit * 2,
      width: "100%",
      height: "100px",
      [theme.breakpoints.up("md")]: {
        height: "300px"
      }
    }
  });

interface PlaceViewState {
  isLoading: boolean;
  place?: PlaceData;
  sensorDataList?: { [sensorId: string]: SensorData };
  airtableData?: AirtableData;
  displayForm: boolean;
  tabValue: number;
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
      tabValue: 0
    };
  }

  async componentDidMount() {
    const { placeId } = this.props.match.params;
    const placesRef = firebase.database().ref(`places/${placeId}`);

    placesRef.once("value", snapshot => {
      if (snapshot) {
        let place: PlaceData | null = snapshot.val() || {};
        console.log(place);

        if (place) {
          this.setState({
            place,
            isLoading: false
          });
        }

        if (place && place.sensors) {
          const sensorIds = Object.keys(place.sensors);
          const promises = sensorIds.map(sensorId =>
            firebase
              .database()
              .ref(`/sensors/${sensorId}`)
              .once("value")
          );

          let sensorDataList: { [sensorId: string]: SensorData } = {};
          Promise.all(promises).then(results => {
            results.forEach(result => {
              const id = result.key;
              const sensor: SensorData | null = result.val();
              if (id && sensor) {
                sensorDataList[id] = sensor;
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
    this.setState({ airtableData });
  }

  render() {
    const { classes } = this.props;
    const { placeId } = this.props.match.params;
    const { isLoading, place, airtableData, sensorDataList } = this.state;

    if (isLoading) return <LinearProgress color="secondary" />;
    if (!place)
      return <Typography>Hmm can't seem to find that place :/</Typography>;

    const { name, lngLat = {} } = place;
    const markerLocation = lngLat
      ? (Object.values(lngLat).reverse() as [number, number])
      : undefined;

    const currentUser = firebase.auth().currentUser;
    const userHasAccess =
      currentUser && place.admins && place.admins[currentUser.uid];
    return (
      <div className={classes.root}>
        <div className={classes.headerRow}>
          <Typography className={classes.title}>
            {name}&nbsp;
            {userHasAccess && (
              <IconButton href={`/places/${placeId}/edit`} aria-label="Edit">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Typography>
          <Typography className={classes.subtitle}>
            307 Lakeshore Blvd. E, Toronto ON
          </Typography>
        </div>
        {markerLocation && (
          <div className={classes.staticMap}>
            <StaticMap
              markerLocation={markerLocation}
              center={markerLocation}
            />
          </div>
        )}
        <Tabs
          className={classes.tabBar}
          value={this.state.tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
            this.setState({ tabValue: newValue });
          }}
          variant="fullWidth"
        >
          <Tab label="Technologies" className={classes.singleTab} />
          <Tab label="Questions" className={classes.singleTab} disabled />
          <Tab label="Shortcuts" className={classes.singleTab} disabled />
        </Tabs>
        <Grid container spacing={8}>
          {sensorDataList &&
            Object.keys(sensorDataList).map(id => {
              const sensor = sensorDataList[id];
              const { name, purpose } = sensor;
              const featuredPurpose =
                purpose && purpose.length ? purpose[0] : undefined;
              let icon: string | null = null;
              if (featuredPurpose && airtableData) {
                const config = airtableData.purpose.find(
                  option => option.name === featuredPurpose
                );
                if (config) icon = `/images/${config.iconShortname}.svg`;
              }
              return (
                <Grid key={id} item xs={4} sm={3}>
                  <Card className={classes.card} elevation={0}>
                    <CardActionArea href={`/sensors/${id}`}>
                      <CardContent className={classes.cardContent}>
                        {icon && (
                          <img className={classes.cardIcon} src={icon} />
                        )}
                        <Typography
                          className={classes.cardIconText}
                          align="center"
                        >
                          {name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          {userHasAccess && !this.state.displayForm && (
            <Fab
              variant="extended"
              aria-label="Add"
              className={classes.addSensorButton}
              color="primary"
              onClick={() => {
                this.setState({ displayForm: true });
              }}
            >
              <AddIcon className={classes.addIcon} />
              Add
            </Fab>
          )}
          {this.state.displayForm && (
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CreateSensorForm placeId={placeId} />
              </Card>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PlaceView);
