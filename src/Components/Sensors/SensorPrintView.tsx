import React, { Component } from 'react';
import firebase from '../../firebase.js';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { AirtableData, getAirtableData, Option } from '../../utils/airtable'
import QRCode from 'qrcode'
import { SensorData } from './index'

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
      // display: "inline-block",
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
  }
});

const badgeSizeToStyle = (badgeSize: number) => {
  return { height: badgeSize + 'in', width: badgeSize + 'in' }
}

interface PurposeBadgeProps {
  readonly classes?: any;
  purpose: string[];
  airtableData: AirtableData;
  badgeSize: number;
}

const PurposeBadge = withStyles(styles)((props: PurposeBadgeProps) => {
  const { classes, purpose, airtableData, badgeSize } = props
  const style = badgeSizeToStyle(badgeSize)
  // Make a badge for anything identifiable or de-indentified
  const featuredPurpose = purpose[0]
  const typeConfig = airtableData.purpose.find(option => option.name === featuredPurpose)
  if (!typeConfig) return null
  const { icon, iconShortname, name } = typeConfig
  return <div className={classes.badge} style={style}>
    <img className={classes.hex} src={`/images/${iconShortname}.svg`} height='100%' width='100%' />
    <div className={classes.stickerContent}>
      <Typography className={classes.stickerText}>{name}</Typography>
    </div>
  </div>
})

interface PrivacyBadgeProps {
  readonly classes?: any;
  techType: string[];
  airtableData: AirtableData;
  badgeSize: number;
}

const PrivacyBadge = withStyles(styles)((props: PrivacyBadgeProps) => {
  const { classes, techType, airtableData, badgeSize } = props
  const style = badgeSizeToStyle(badgeSize)
  // Make a badge for anything identifiable or de-indentified
  const prioritizedTechType = techType.filter(type => type.includes('dentif'))
  return <>
    {prioritizedTechType.map(ptt => {
      const typeConfig = airtableData.techType.find(option => option.name === ptt)
      if (!typeConfig) {
        return null
      }
      const { icon, iconShortname, name } = typeConfig
      const hexUrl = iconShortname.includes('yellow') ? YELLOW_HEX_URL : iconShortname.includes('blue') ? BLUE_HEX_URL : WHITE_HEX_URL
      return <div key={name} className={classes.badge} style={style}>
        <img className={classes.hex} src={`/images/${iconShortname}.svg`} height='100%' width='100%' />
        <div className={classes.stickerContent}>
          <Typography className={classes.stickerText}>{name}</Typography>
        </div>
      </div>
    })}
  </>
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
      <Typography className={classes.stickerText}>{accountable}</Typography>
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
      {showURL && url && <Typography className={classes.stickerText} style={{ fontSize: '9px' }} >
        {url}
      </Typography>}
    </div>
  </div>
})

interface SensorPrintViewState {
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
          sensor
        });

        if (sensor.logoRef) {
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
      const sensorUrl = `${window.location.origin}/sensors/${sensorId}`
      const qrcodeSrc = await QRCode.toDataURL(sensorUrl)
      this.setState({ qrcodeSrc, sensorUrl })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { classes } = this.props
    const { sensor, airtableData, qrcodeSrc, sensorUrl, logoSrc, badgeSize } = this.state
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
          {sensor.accountable && <AccountabilityBadge accountable={sensor.accountable} logoSrc={logoSrc} badgeSize={badgeSize} />}
          {qrcodeSrc && <QRBadge url={sensorUrl} qrcodeSrc={qrcodeSrc} badgeSize={badgeSize} />}
          {sensor.techType && sensor.techType.length && <PrivacyBadge techType={sensor.techType} airtableData={airtableData} badgeSize={badgeSize} />}
          {sensor.purpose && <PurposeBadge purpose={sensor.purpose} airtableData={airtableData} badgeSize={badgeSize} />}
        </div>}
      </div>
    );
  }
}

export default withStyles(styles)(SensorPrintView);
