import React, { Component } from 'react';
import firebase from '../../firebase.js';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { AirtableData, getAirtableData, Option } from '../../utils/airtable'
import QRCode from 'qrcode'
import { SensorData } from './index'
import LinearProgress from '@material-ui/core/LinearProgress';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const WHITE_HEX_URL = '/images/container/white/hexagon.svg'
const OUTLINED_HEX_URL = '/images/container/hexagon.svg'
const YELLOW_HEX_URL = '/images/container/yellow/hexagon.svg'
const BLUE_HEX_URL = '/images/container/blue/hexagon.svg'
const BLACK_HEX_URL = '/images/container/black/hexagon.svg'

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      margin: 'auto',
      padding: theme.spacing.unit * 2,
      maxWidth: 'calc(100% - 167px)',
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 4,
    },
    '@media print': {
      margin: 0,
      padding: 0,
      width: '100%',
    },
  },
  header: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: 0,
    },
  },
  noPrint: {
    '@media all': {
      display: 'block',
    },
    '@media print': {
      display: 'none',
    },
  },
  printOnly: {
    '@media all': {
      display: 'none',
    },
    '@media print': {
      display: 'block',
    },
  },
  badgeContainer: {
    background: theme.palette.grey["200"],
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    '@media print': {
      background: 'white',
      margin: 0,
      padding: 0,
      width: '100%',

      display: "block",
      float: 'none',
    },
  },
  badge: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    width: '300px',
    position: 'relative',
    margin: theme.spacing.unit * 2,
    pageBreakInside: 'avoid',
    transition: 'all 0.8s ease-out',

    '@media print': {
      pageBreakInside: 'avoid',
      float: 'none',
    },
  },
  hex: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pageBreakInside: 'avoid',
  },
  stickerContent: {
    flex: 1,
    height: '100%',
    position: 'relative',
    display: "flex",
    margin: '30px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    pageBreakInside: 'avoid',
  },
  stickerText: {
    minWidth: 0,
    maxWidth: '70%',
  }
});

const badgeSizeToStyle = (badgeSize: number) => {
  return { height: badgeSize + 'in', width: badgeSize + 'in' }
}

interface IconBadgeProps {
  readonly classes?: any;
  airtableData: AirtableData;
  airtableKey: 'techType' | 'purpose'
  badgeName: string;
  badgeSize: number;
}

const IconBadge = withStyles(styles)((props: IconBadgeProps) => {
  const { classes, airtableKey, badgeName, airtableData, badgeSize } = props
  const style = badgeSizeToStyle(badgeSize)
  const iconWrapperStyle = badgeSizeToStyle(badgeSize / 2)

  const config = airtableData[airtableKey].find(option => option.name === badgeName)
  if (!config) {
    return null
  }
  const { iconShortname, name } = config
  let hexUrl = WHITE_HEX_URL
  let iconPath = iconShortname.replace(/\/(?=[^\/]*$)/, '/ic_black/')
  let fontColor = 'black'

  if (iconShortname.includes('yellow')) {
    hexUrl = YELLOW_HEX_URL
    iconPath = iconShortname.replace("/yellow/", "/ic_black/");
  } else if (iconShortname.includes('blue')) {
    hexUrl = BLUE_HEX_URL
    iconPath = iconShortname.replace("/blue/", "/ic_black/");
  } else if (iconShortname.includes('black')) {
    hexUrl = BLACK_HEX_URL
    iconPath = iconShortname.replace("/black/", "/ic_white/")
    fontColor = 'white'
  } else if (airtableKey === 'purpose') {
    // the name is inconsistent so we explitcly check for the purpose case :/
    hexUrl = BLACK_HEX_URL
    iconPath = iconShortname.replace(/\/(?=[^\/]*$)/, '/ic_white/')
    fontColor = 'white'
  }
  return <div key={name} className={classes.badge} style={style}>
    <img className={classes.hex} src={hexUrl} height='100%' width='100%' />
    <div className={classes.stickerContent} style={{ color: fontColor }}>
      <div style={{ ...iconWrapperStyle, transition: 'all 0.8s ease-out' }}>
        <img src={`/images/${iconPath}.svg`} height='100%' width='100%' />
      </div>
      <Typography className={classes.stickerText} variant='subtitle2' color='inherit'>{name}</Typography>
    </div>
  </div>
})

const AccountabilityBadge = withStyles(styles)((props: any) => {
  const { classes, accountable, logoSrc, badgeSize } = props
  const style = badgeSizeToStyle(badgeSize)
  const logoWrapperStyle = badgeSizeToStyle(badgeSize / 2.5)
  return <div className={classes.badge} style={style}>
    <img className={`${classes.hex} ${classes.noPrint}`} src={WHITE_HEX_URL} height='100%' width='100%' />
    <img className={`${classes.hex} ${classes.printOnly}`} src={OUTLINED_HEX_URL} height='100%' width='100%' />
    <div className={classes.stickerContent}>
      <div style={{ ...logoWrapperStyle, transition: 'all 0.8s ease-out' }}>
        <img src={logoSrc} height='100%' width='100%' />
      </div>
      <Typography variant='subtitle2'>{accountable}</Typography>
    </div>
  </div>
})

const QRBadge = withStyles(styles)((props: any) => {
  const { classes, qrcodeSrc, url, badgeSize } = props
  const style = badgeSizeToStyle(badgeSize)
  const qrWrapperStyle = badgeSizeToStyle(badgeSize / 2.5)
  const showURL = badgeSize >= 2
  return <div className={classes.badge} style={style}>
    <img className={`${classes.hex} ${classes.noPrint}`} src={WHITE_HEX_URL} height='100%' width='100%' />
    <img className={`${classes.hex} ${classes.printOnly}`} src={OUTLINED_HEX_URL} height='100%' width='100%' />
    <div className={classes.stickerContent}>
      <div style={{ ...qrWrapperStyle, transition: 'all 0.8s ease-out' }}>
        <img src={qrcodeSrc} height='100%' width='100%' />
      </div>
      {showURL && url && <Typography variant='subtitle2' style={{ fontSize: '9px' }} >
        {url}
      </Typography>}
    </div>
  </div>
})

interface SensorPrintViewState {
  isLoading: boolean,
  sensor?: SensorData;
  displayForm: boolean;
  airtableData?: AirtableData;
  sensorUrl?: string;
  qrcodeSrc?: string;
  logoSrc?: string;
  badgeSize: number;
}

class SensorPrintView extends Component<any, SensorPrintViewState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      sensor: undefined,
      displayForm: false,
      airtableData: undefined,
      sensorUrl: undefined,
      qrcodeSrc: undefined,
      badgeSize: 2
    };
  }

  async componentDidMount() {
    const airtableData = await getAirtableData();
    this.setState({ airtableData })
    const { sensorId } = this.props.match.params
    const sensorRef = firebase.database().ref(`sensors/${sensorId}`);
    sensorRef.on('value', (snapshot) => {
      if (snapshot) {
        let sensor = snapshot.val();

        this.setState({
          sensor,
          isLoading: false
        });

        if (sensor && sensor.logoRef) {
          const storageRef = firebase.storage().ref();
          storageRef.child(sensor.logoRef).getDownloadURL().then((logoSrc) => {
            this.setState({ logoSrc })
          }).catch(function (error) {
            console.log(error)
          });
        }
      }
    });

    try {
      const sensorUrl = `${window.location.origin}/${sensorId}`
      const qrcodeSrc = await QRCode.toDataURL(sensorUrl)
      this.setState({ qrcodeSrc, sensorUrl })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { classes } = this.props
    const { isLoading, sensor, airtableData, qrcodeSrc, sensorUrl, logoSrc, badgeSize } = this.state

    if (isLoading) return <LinearProgress color="secondary" />
    if (!sensor) return <Typography>Hmm can't find that sensor :/</Typography>

    // Make a badge for anything identifiable or de-indentified
    const prioritizedTechTypes = (sensor && sensor.techType) ? sensor.techType.filter(type => type.includes('dentif')) : []

    // Make a badge for only the first purpose
    const featuredPurpose = sensor ? sensor.purpose[0] : undefined

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography className={classes.noPrint} gutterBottom variant="h6" component="h2">Print</Typography>
          <Typography className={classes.noPrint} paragraph>Print this page and cut out the labels for use in your own signage. Or download the images for further layout customization (coming soon).</Typography>
          <FormControl className={classes.noPrint}>
            <InputLabel htmlFor="select-multiple">Size</InputLabel>
            <Select
              value={badgeSize}
              onChange={(e) => { this.setState({ badgeSize: parseFloat(e.target.value) }) }}
              input={<Input id="select" />}
            >
              <MenuItem value={2} >2 inches</MenuItem>
              <MenuItem value={3} >3 inches</MenuItem>
              <MenuItem value={4} >4 inches</MenuItem>
              <MenuItem value={5} >5 inches</MenuItem>
              <MenuItem value={6} >6 inches</MenuItem>
              <MenuItem value={7} >7 inches</MenuItem>
              <MenuItem value={8} >8 inches</MenuItem>
            </Select>
            <Button className={classes.noPrint} onClick={() => window.print()} variant='contained' color='primary'>
              Print Labels
            </Button>
          </FormControl>
        </div>
        {sensor && airtableData && <div className={classes.badgeContainer}>
          {logoSrc && sensor.accountable && <AccountabilityBadge accountable={sensor.accountable} logoSrc={logoSrc} badgeSize={badgeSize} />}
          {qrcodeSrc && <QRBadge url={sensorUrl} qrcodeSrc={qrcodeSrc} badgeSize={badgeSize} />}
          {!!prioritizedTechTypes.length && prioritizedTechTypes.map(techType => (
            <IconBadge key={techType} airtableKey='techType' badgeName={techType} airtableData={airtableData} badgeSize={badgeSize} />
          ))}
          {featuredPurpose && <IconBadge airtableKey='purpose' badgeName={featuredPurpose} airtableData={airtableData} badgeSize={badgeSize} />}
        </div>}
      </div>
    );
  }
}

export default withStyles(styles)(SensorPrintView);
