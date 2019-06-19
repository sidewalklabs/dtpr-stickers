import React from "react";
import firebase from "../../firebase.js";
import SensorForm from "./SensorForm";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Redirect, withRouter } from "react-router-dom";
import { SensorData } from "./index";
import { PlaceData } from "../Places";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

interface State {
  allowAccess: boolean;
  isLoading: boolean;
  sensorData: SensorData;
  sensorImageSrc: string;
  logoSrc: string;
}

class EditSensorForm extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      allowAccess: true,
      isLoading: true,
      sensorImageSrc: "",
      logoSrc: "",
      sensorData: {
        name: "",
        placeId: "",
        headline: "",
        description: "",
        accountable: "",
        accountableDescription: "",
        purpose: [],
        techType: [],
        dataType: [],
        dataProcess: [],
        access: [],
        storage: [],
        phone: "",
        chat: "",
        email: "",
        onsiteStaff: false,
        logoRef: "",
        sensorImageRef: ""
      }
    };
  }

  async componentDidMount() {
    const user = firebase.auth().currentUser;
    const { sensorId } = this.props.match.params;
    const sensorRef = firebase.database().ref(`sensors/${sensorId}`);
    sensorRef.on("value", snapshot => {
      if (snapshot) {
        const sensorData: SensorData | null = snapshot.val();
        if (!sensorData) {
          this.setState({ isLoading: false });
        } else {
          // Some of these fields may not exist for that object, so set a default val
          this.setState({
            sensorData: {
              name: sensorData.name || "",
              placeId: sensorData.placeId || "",
              headline: sensorData.headline || "",
              description: sensorData.description || "",
              accountable: sensorData.accountable || "",
              accountableDescription: sensorData.accountableDescription || "",
              purpose: sensorData.purpose || [],
              techType: sensorData.techType || [],
              dataType: sensorData.dataType || [],
              dataProcess: sensorData.dataProcess || [],
              access: sensorData.access || [],
              storage: sensorData.storage || [],
              phone: sensorData.phone || "",
              chat: sensorData.chat || "",
              email: sensorData.email || "",
              onsiteStaff: sensorData.onsiteStaff || false,
              logoRef: sensorData.logoRef || "",
              sensorImageRef: sensorData.sensorImageRef || ""
            },
            isLoading: false
          });

          if (user && sensorData.placeId) {
            firebase
              .database()
              .ref(`places/${sensorData.placeId}`)
              .once("value", snapshot => {
                if (snapshot) {
                  const place: PlaceData | null = snapshot.val();
                  if (place) {
                    const { uid } = user;
                    const allowAccess =
                      (uid && place.admins && place.admins[uid]) || false;
                    this.setState({ allowAccess });
                  }
                }
              });
          }
        }
      }
    });
  }

  render() {
    const { classes, match } = this.props;
    const { sensorId } = match.params;
    const { isLoading, allowAccess, sensorData } = this.state;

    if (isLoading) return <LinearProgress color="secondary" />;
    if (!allowAccess) return <Redirect to={`/sensors/${sensorId}/`} />;
    if (!sensorData)
      return <Typography>Hmm can't find that sensor :/</Typography>;

    return (
      <div className={classes.root}>
        <SensorForm sensorId={sensorId} sensorData={sensorData} />
      </div>
    );
  }
}

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
    }
  });

export default withStyles(styles, { withTheme: true })(
  withRouter(EditSensorForm)
);
