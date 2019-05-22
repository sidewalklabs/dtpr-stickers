import React, { Component } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import showdown from 'showdown';

const paragraphTagFilter = {
  type: 'output',
  filter: function (text: string, converter: any) {
    var re = /<\/?p[^>]*>/ig;
    text = text.replace(re, '');
    return text;
  }
};

// @ts-ignore
const markdownConverter = new showdown.Converter({
  simplifiedAutoLink: true,
  simpleLineBreaks: true,
  openLinksInNewWindow: true,
  emoji: true,
  extensions: [paragraphTagFilter]
});

const styles = (theme: Theme) => createStyles({
  expansionPanelRoot: {
    backgroundImage: 'url(/images/chain/middle.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '24px 0',
    boxShadow: 'none',
    '&:first-of-type': {
      backgroundImage: 'url(/images/chain/top.svg)',
    },
    '&:last-of-type': {
      backgroundImage: 'url(/images/chain/bottom.svg)',
    },
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expansionPanelExpanded: {
    margin: '0',
  },
  expansionPanelSummaryRoot: {
    margin: '0',
    minHeight: '56px',
    '&$expansionPanelSummaryExpanded': {
      margin: 0,
      minHeight: '56px',
    },
  },
  expansionPanelSummaryContent: {
    margin: '0',
    '&>:last-child': {
      paddingRight: 0,
    },
    '&$expansionPanelSummaryExpanded': {
      margin: 0,
    },
  },
  expansionPanelSummaryExpanded: {
    // class used for expanded key
    // needed for nested reference
  },
  expansionPanelDetailsRoot: {
    borderLeft: '2px solid #000',
    marginLeft: theme.spacing.unit * 5 + 1,
    paddingLeft: theme.spacing.unit * 3,
    paddingTop: 0,
    paddingRight: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2,
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
});

interface Props {
  readonly classes: any;
  icon: string;
  title: string;
  label: string;
  body: string;
}

class SensorView extends Component<Props, any> {
  render() {
    const { classes, icon, title, label, body } = this.props
    const parsedBody = markdownConverter.makeHtml(body)

    return (
      <ExpansionPanel classes={{ root: classes.expansionPanelRoot, expanded: classes.expansionPanelExpanded }}>
        <ExpansionPanelSummary classes={{ root: classes.expansionPanelSummaryRoot, content: classes.expansionPanelSummaryContent, expanded: classes.expansionPanelSummaryExpanded }}>
          <img src={icon}></img>
          <Typography className={classes.heading}>{title}</Typography>
          <Typography color='textSecondary' className={classes.label}>{label}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetailsRoot }}>
          <Typography dangerouslySetInnerHTML={{ __html: parsedBody }} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(SensorView);
