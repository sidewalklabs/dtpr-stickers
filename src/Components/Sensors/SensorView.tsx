import React, { Component } from 'react';
import firebase from '../../firebase.js';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { SensorData } from './index'
import { AirtableData, getAirtableData, Option } from '../../utils/airtable'
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import BackIcon from '@material-ui/icons/ArrowBack'
import Accordian from './Accordian'
import { PlaceData } from '../Places'

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    margin: 'auto',
    paddingTop: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      maxWidth: theme.breakpoints.values.md,
    },
  },
  toolbarRight: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  header: {
    padding: theme.spacing.unit * 3,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.unit * 3,
  },
  footer: {
    background: theme.palette.grey["200"],
    marginTop: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 3,
  },
  summaryWrapper: {
    display: 'flex',
    padding: theme.spacing.unit * 3,
  },
  summaryCell: {
    flex: 1,
    textAlign: 'center'
  },
  summaryBadge: {
    height: '48px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit,
  },
  heading: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: theme.spacing.unit
  },
  label: {
    alignSelf: 'center',
    marginLeft: theme.spacing.unit,
  },
  sensorImage: {
    width: '100%',
    maxWidth: '100%',
    maxHeight: '300px',
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2,
  },
});

interface State {
  sensorData?: SensorData;
  parentPlaceName?: string;
  isLoading: boolean;
  logoSrc?: string;
  sensorImageSrc?: string;
  airtableData?: AirtableData;
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
    };
  }

  async componentDidMount() {
    const airtableData = await getAirtableData();
    this.setState({ airtableData })
    const { sensorId } = this.props.match.params
    const sensorRef = firebase.database().ref(`sensors/${sensorId}`);
    sensorRef.on('value', (snapshot) => {
      if (snapshot) {
        const val: SensorData = snapshot.val();
        const {
          name = '',
          placeId = '',
          headline = '',
          description = '',
          accountable = '',
          accountableDescription = '',
          purpose = [],
          techType = [],
          dataType = [],
          dataProcess = [],
          access = [],
          storage = [],
          phone = '',
          chat = '',
          email = '',
          onsiteStaff = '',
          logoRef = '',
          sensorImageRef = ''
        } = val
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
          isLoading: false,
        });

        if (sensorImageRef) {
          const storageRef = firebase.storage().ref();
          storageRef.child(sensorImageRef).getDownloadURL().then((sensorImageSrc) => {
            this.setState({ sensorImageSrc })
          }).catch(function (error) {
            console.log(error)
          });
        }

        if (logoRef) {
          const storageRef = firebase.storage().ref();
          storageRef.child(logoRef).getDownloadURL().then((logoSrc) => {
            this.setState({ logoSrc })
          }).catch(function (error) {
            console.log(error)
          });
        }

        if (placeId) {
          const placeRef = firebase.database().ref(`places/${placeId}`).once('value', (snapshot) => {
            if (snapshot) {
              const place: PlaceData | null = snapshot.val();
              if (place) {
                this.setState({ parentPlaceName: place.name })
              }
            }
          })
        }
      }
    });
  }

  render() {
    const { classes } = this.props
    const { isLoading, parentPlaceName, sensorData, logoSrc, sensorImageSrc, airtableData } = this.state

    if (isLoading) return <LinearProgress color="secondary" />
    if (!sensorData) return null

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
      onsiteStaff,
    } = sensorData

    let purposeBadgeOption: Option | undefined = undefined
    let techTypeBadgeOption: Option | undefined = undefined
    let accountableBadgeOption: Option | undefined = undefined
    if (airtableData) {
      purposeBadgeOption = (purpose && purpose[0] && airtableData.purpose.find((option) => option.name === purpose[0])) || undefined
      techTypeBadgeOption = (techType && techType[0] && airtableData.techType.find((option) => option.name === techType[0])) || undefined
      accountableBadgeOption = (accountable && airtableData.accountable[0]) || undefined
    }

    const hasfooter = phone || chat || email || onsiteStaff
    return (
      <div className={classes.root}>
        <Toolbar>
          {placeId && parentPlaceName && <Button href={`/places/${placeId}`} color='primary'>
            <BackIcon className={classes.backButton} fontSize="small" />
            See all sensors at {parentPlaceName}
          </Button>}
          <div className={classes.toolbarRight}>
            <Button href={`${window.location.href}/print`} color='primary'>
              Try the Sticker Maker
            </Button>
          </div>
        </Toolbar>
        <div className={classes.header}>
          {headline && <Typography gutterBottom variant="h4" component="h2" align='center' style={{ wordBreak: 'break-word' }}>{headline}</Typography>}

        </div>
        <Divider variant='fullWidth' />
        <div className={classes.summaryWrapper}>
          {purposeBadgeOption && <div className={classes.summaryCell}>
            <img className={classes.summaryBadge} src={purposeBadgeOption.icon}></img>
            <Typography variant="subtitle2">{purposeBadgeOption.name}</Typography>
          </div>}
          {techTypeBadgeOption && <div className={classes.summaryCell}>
            <img className={classes.summaryBadge} src={techTypeBadgeOption.icon}></img>
            <Typography variant="subtitle2">{techTypeBadgeOption.name}</Typography>
          </div>}
          {accountableBadgeOption && <div className={classes.summaryCell}>
            <img className={classes.summaryBadge} src={logoSrc || accountableBadgeOption.icon}></img>
            <Typography variant="subtitle2">{accountable}</Typography>
          </div>}
        </div>
        <Divider variant='fullWidth' />
        <div className={classes.content}>
          {sensorImageSrc && <img className={classes.sensorImage} src={sensorImageSrc}></img>}
          {description && <Typography align='center' paragraph>{description}</Typography>}
        </div>
        {airtableData && <div>
          {accountable && accountableDescription && <Accordian icon={airtableData.accountable[0].icon} title={accountable} label='Accountability' body={accountableDescription} />}
          {purpose && purpose.map(name => {
            const option = airtableData.purpose.find((airtableOption) => airtableOption.name === name)
            if (!option) return null;
            return <Accordian key={option.name} icon={option.icon} title={option.name} label='Purpose' body={option.description} />
          })}
          {techType && techType.map(name => {
            const option = airtableData.techType.find((airtableOption) => airtableOption.name === name)
            if (!option) return null;
            return <Accordian key={option.name} icon={option.icon} title={option.name} label='Technology Type' body={option.description} />
          })}
          {dataType && dataType.map(name => {
            const option = airtableData.dataType.find((airtableOption) => airtableOption.name === name)
            if (!option) return null;
            return <Accordian key={option.name} icon={option.icon} title={option.name} label='Data Type' body={option.description} />
          })}
          {dataProcess && dataProcess.map(name => {
            const option = airtableData.dataType.find((airtableOption) => airtableOption.name === name)
            if (!option) return null;
            return <Accordian key={option.name} icon={option.icon} title={option.name} label='Data Processing' body={option.description} />
          })}
          {access && access.map(name => {
            const option = airtableData.access.find((airtableOption) => airtableOption.name === name)
            if (!option) return null;
            return <Accordian key={option.name} icon={option.icon} title={option.name} label='Access' body={option.description} />
          })}
          {storage && storage.map(name => {
            const option = airtableData.storage.find((airtableOption) => airtableOption.name === name)
            if (!option) return null;
            return <Accordian key={option.name} icon={option.icon} title={option.name} label='Storage' body={option.description} />
          })}
        </div>}
        {hasfooter && <div className={classes.footer}>
          <Typography gutterBottom variant="h6">Want to know more?</Typography>
          {email && <div>
            <Typography variant="subtitle2" inline>Email:</Typography>
            <Typography gutterBottom variant="body2" inline>&nbsp;{email}</Typography>
          </div>}
          {phone && <div>
            <Typography variant="subtitle2" inline>Call:</Typography>
            <Typography gutterBottom variant="body2" inline>&nbsp;{phone}</Typography>
          </div>}
          {chat && <div>
            <Typography variant="subtitle2" inline>Chat:</Typography>
            <Typography gutterBottom variant="body2" inline>&nbsp;{chat}</Typography>
          </div>}
          {onsiteStaff && <div>
            <Typography variant="subtitle2" inline>Visit:</Typography>
            <Typography gutterBottom variant="body2" inline>Chat with our on-site staff</Typography>
          </div>}
        </div>}
      </div>
    );
  }
}

export default withStyles(styles)(SensorView);
