import React, { Component } from "react";
import firebase from "../../firebase.js";
import { createStyles, withStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { SensorData } from "./index";
import { AirtableData, getAirtableData, Option } from "../../utils/airtable";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Toolbar from "@material-ui/core/Toolbar";
import BackIcon from "@material-ui/icons/ArrowBack";
import Accordian from "./Accordian";
import FeedbackFooter from "../FeedbackFooter";
import { PlaceData } from "../Places";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: "auto",
      paddingTop: theme.spacing.unit * 2,
      [theme.breakpoints.up("md")]: {
        maxWidth: theme.breakpoints.values.md
      }
    },
    toolbar: {
      flexWrap: "wrap",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        alignItems: "start"
      },
      borderBottom: "0.5px solid rgba(0,0,0,.2)",
      minHeight: "48px"
    },
    toolbarRight: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap"
    },
    backButton: {
      borderRadius: "16px",
      fontWeight: 700,
      textTransform: "none",
      flexShrink: 0,
      padding: "0 16px 0 8px",
      height: "32px"
    },
    backButtonIcon: {
      marginRight: theme.spacing.unit
    },
    backButtonText: {
      marginBottom: "-2px"
    },
    header: {
      padding: theme.spacing.unit * 3,
      textAlign: "center"
    },
    content: {
      padding: theme.spacing.unit * 2
    },
    footer: {
      background: theme.palette.grey["200"],
      marginTop: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 3
    },
    summaryWrapper: {
      display: "flex",
      padding: theme.spacing.unit * 2
    },
    summaryCell: {
      flex: 1,
      textAlign: "center"
    },
    summaryBadge: {
      height: "48px",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: theme.spacing.unit
    },
    heading: {
      flex: 1,
      alignSelf: "center",
      marginLeft: theme.spacing.unit
    },
    label: {
      alignSelf: "center",
      marginLeft: theme.spacing.unit
    },
    sensorImage: {
      width: "100%",
      maxWidth: "100%",
      maxHeight: "300px",
      margin: "auto",
      marginBottom: theme.spacing.unit * 2
    }
  });

interface State {
  sensorData?: SensorData;
  parentPlaceName?: string;
  isLoading: boolean;
  logoSrc?: string;
  sensorImageSrc?: string;
  airtableData?: AirtableData;
  isAdmin: boolean;
}

class SensorView extends Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      sensorData: undefined,
      isLoading: true,
      parentPlaceName: undefined,
      logoSrc: undefined,
      sensorImageSrc: undefined,
      airtableData: undefined,
      isAdmin: false
    };
  }

  async componentDidMount() {
    const airtableData = await getAirtableData();
    this.setState({ airtableData });
    const { sensorId } = this.props.match.params;
    const sensorRef = firebase.database().ref(`sensors/${sensorId}`);
    sensorRef.on("value", snapshot => {
      if (snapshot) {
        const sensorData: SensorData | null = snapshot.val();
        if (!sensorData) {
          this.setState({ isLoading: false });
        } else {
          // Some of these fields may not exist for that object, so set a default val
          const {
            name = "",
            placeId = "",
            headline = "",
            description = "",
            accountable = "",
            accountableDescription = "",
            purpose = [],
            techType = [],
            dataType = [],
            dataProcess = [],
            access = [],
            storage = [],
            phone = "",
            chat = "",
            email = "",
            onsiteStaff = false,
            logoRef = "",
            sensorImageRef = ""
          } = sensorData;
          this.setState({
            sensorData: {
              name,
              placeId,
              headline,
              description,
              accountable,
              accountableDescription,
              purpose,
              techType,
              dataType,
              dataProcess,
              access,
              storage,
              phone,
              chat,
              email,
              onsiteStaff,
              logoRef,
              sensorImageRef
            },
            isLoading: false
          });

          if (sensorImageRef) {
            const storageRef = firebase.storage().ref();
            storageRef
              .child(sensorImageRef)
              .getDownloadURL()
              .then(sensorImageSrc => {
                this.setState({ sensorImageSrc });
              })
              .catch(function(error) {
                console.log(error);
              });
          }

          if (logoRef) {
            const storageRef = firebase.storage().ref();
            storageRef
              .child(logoRef)
              .getDownloadURL()
              .then(logoSrc => {
                this.setState({ logoSrc });
              })
              .catch(function(error) {
                console.log(error);
              });
          }

          if (placeId) {
            firebase
              .database()
              .ref(`places/${placeId}`)
              .once("value", snapshot => {
                if (snapshot) {
                  const place: PlaceData | null = snapshot.val();
                  if (place) {
                    this.setState({ parentPlaceName: place.name });
                    const user = firebase.auth().currentUser;
                    if (user) {
                      const { uid } = user;
                      const isAdmin =
                        (uid && place.admins && place.admins[uid]) || false;
                      this.setState({ isAdmin });
                    }
                  }
                }
              });
          }
        }
      }
    });
  }

  render() {
    const { classes } = this.props;
    const {
      isLoading,
      isAdmin,
      parentPlaceName,
      sensorData,
      logoSrc,
      sensorImageSrc,
      airtableData
    } = this.state;
    const { sensorId } = this.props.match.params;

    if (isLoading) return <LinearProgress color="secondary" />;
    if (!sensorData)
      return <Typography>Hmm can't find that sensor :/</Typography>;

    const {
      placeId,
      headline,
      description,
      accountable,
      accountableDescription,
      purpose,
      techType,
      dataType,
      dataProcess,
      access,
      storage,
      phone,
      chat,
      email,
      onsiteStaff
    } = sensorData;

    let purposeBadgeOption: Option | undefined = undefined;
    let techTypeBadgeOption: Option | undefined = undefined;
    let accountableBadgeOption: Option | undefined = undefined;
    if (airtableData) {
      purposeBadgeOption =
        (purpose &&
          purpose[0] &&
          airtableData.purpose.find(option => option.name === purpose[0])) ||
        undefined;
      techTypeBadgeOption =
        (techType &&
          techType[0] &&
          airtableData.techType.find(option => option.name === techType[0])) ||
        undefined;
      accountableBadgeOption =
        (accountable && airtableData.accountable[0]) || undefined;
    }

    const hasfooter = phone || chat || email || onsiteStaff;
    return (
      <div className={classes.root}>
        <Toolbar className={classes.toolbar}>
          {placeId && parentPlaceName && (
            <Button
              className={classes.backButton}
              href={`/places/${placeId}`}
              color="primary"
              variant="outlined"
              size="small"
            >
              <BackIcon className={classes.backButtonIcon} fontSize="small" />
              <div className={classes.backButtonText}>{parentPlaceName}</div>
            </Button>
          )}
          {isAdmin && (
            <div className={classes.toolbarRight}>
              <Button
                href={`/sensors/${sensorId}/print`}
                color="primary"
                size="small"
              >
                Try the Sticker Maker
              </Button>
              <Button
                href={`/sensors/${sensorId}/edit`}
                color="primary"
                variant="contained"
                size="small"
              >
                Edit
              </Button>
            </div>
          )}
        </Toolbar>
        <div className={classes.header}>
          {headline && (
            <Typography
              gutterBottom
              variant="h6"
              align="center"
              style={{ wordBreak: "break-word", fontWeight: "bold" }}
            >
              {headline}
            </Typography>
          )}
        </div>
        <Divider variant="fullWidth" />
        <div className={classes.summaryWrapper}>
          {purposeBadgeOption && (
            <div className={classes.summaryCell}>
              <img
                className={classes.summaryBadge}
                src={`/images/${purposeBadgeOption.iconShortname}.svg`}
              />
              <Typography variant="subtitle2">
                {purposeBadgeOption.name}
              </Typography>
            </div>
          )}
          {techTypeBadgeOption && (
            <div className={classes.summaryCell}>
              <img
                className={classes.summaryBadge}
                src={`/images/${techTypeBadgeOption.iconShortname}.svg`}
              />
              <Typography variant="subtitle2">
                {techTypeBadgeOption.name}
              </Typography>
            </div>
          )}
          {accountableBadgeOption && (
            <div className={classes.summaryCell}>
              <img
                className={classes.summaryBadge}
                src={
                  logoSrc ||
                  `/images/${accountableBadgeOption.iconShortname}.svg`
                }
              />
              <Typography variant="subtitle2">{accountable}</Typography>
            </div>
          )}
        </div>
        <Divider variant="fullWidth" />
        <div className={classes.content}>
          {sensorImageSrc && (
            <img className={classes.sensorImage} src={sensorImageSrc} />
          )}
          {description && <Typography paragraph>{description}</Typography>}
        </div>
        {airtableData && (
          <div>
            {accountableBadgeOption && accountableDescription && (
              <Accordian
                icon={`/images/${accountableBadgeOption.iconShortname}.svg`}
                title={accountable}
                label="Accountability"
                body={accountableDescription}
              />
            )}
            {purpose &&
              purpose.map(name => {
                const option = airtableData.purpose.find(
                  airtableOption => airtableOption.name === name
                );
                if (!option) return null;
                return (
                  <Accordian
                    key={option.name}
                    icon={`/images/${option.iconShortname}.svg`}
                    title={option.name}
                    label="Purpose"
                    body={option.description}
                  />
                );
              })}
            {techType &&
              techType.map(name => {
                const option = airtableData.techType.find(
                  airtableOption => airtableOption.name === name
                );
                if (!option) return null;
                return (
                  <Accordian
                    key={option.name}
                    icon={`/images/${option.iconShortname}.svg`}
                    title={option.name}
                    label="Technology Type"
                    body={option.description}
                  />
                );
              })}
            {dataType &&
              dataType.map(name => {
                const option = airtableData.dataType.find(
                  airtableOption => airtableOption.name === name
                );
                if (!option) return null;
                return (
                  <Accordian
                    key={option.name}
                    icon={`/images/${option.iconShortname}.svg`}
                    title={option.name}
                    label="Data Type"
                    body={option.description}
                  />
                );
              })}
            {dataProcess &&
              dataProcess.map(name => {
                const option = airtableData.dataType.find(
                  airtableOption => airtableOption.name === name
                );
                if (!option) return null;
                return (
                  <Accordian
                    key={option.name}
                    icon={`/images/${option.iconShortname}.svg`}
                    title={option.name}
                    label="Data Processing"
                    body={option.description}
                  />
                );
              })}
            {access &&
              access.map(name => {
                const option = airtableData.access.find(
                  airtableOption => airtableOption.name === name
                );
                if (!option) return null;
                return (
                  <Accordian
                    key={option.name}
                    icon={`/images/${option.iconShortname}.svg`}
                    title={option.name}
                    label="Access"
                    body={option.description}
                  />
                );
              })}
            {storage &&
              storage.map(name => {
                const option = airtableData.storage.find(
                  airtableOption => airtableOption.name === name
                );
                if (!option) return null;
                return (
                  <Accordian
                    key={option.name}
                    icon={`/images/${option.iconShortname}.svg`}
                    title={option.name}
                    label="Storage"
                    body={option.description}
                  />
                );
              })}
          </div>
        )}
        <FeedbackFooter placeName={this.state.parentPlaceName} />
        {/* {hasfooter && (
          <div className={classes.footer}>
            <Typography gutterBottom variant="h6">
              Want to know more?
            </Typography>
            {email && (
              <div>
                <Typography variant="subtitle2" inline>
                  Email:&nbsp;
                </Typography>
                <Typography gutterBottom variant="body2" inline>
                  <a href={`mailto:${email}`}>{email}</a>
                </Typography>
              </div>
            )}
            {phone && (
              <div>
                <Typography variant="subtitle2" inline>
                  Call:&nbsp;
                </Typography>
                <Typography gutterBottom variant="body2" inline>
                  {phone}
                </Typography>
              </div>
            )}
            {chat && (
              <div>
                <Typography variant="subtitle2" inline>
                  Chat:&nbsp;
                </Typography>
                <Typography gutterBottom variant="body2" inline>
                  <a href={chat} target="_blank">
                    {chat}
                  </a>
                </Typography>
              </div>
            )}
            {onsiteStaff && (
              <div>
                <Typography variant="subtitle2" inline>
                  Visit:&nbsp;
                </Typography>
                <Typography gutterBottom variant="body2" inline>
                  Chat with our on-site staff
                </Typography>
              </div>
            )}
          </div>
        )} */}
      </div>
    );
  }
}

export default withStyles(styles)(SensorView);
