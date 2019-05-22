import React, { Component } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'calc(100% - 167px)',
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 4,
    },
  },
});

class Home extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h6" component="h2">Welcome to DTPR!</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
