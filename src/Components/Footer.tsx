import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

class Footer extends Component<any, any> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography align='center'>
          This is an open-source prototype from the Digital Transparency in the Public Realm project.
        </Typography>
        <Button href="/" style={{ backgroundColor: 'transparent' }} color='secondary'>Learn more here</Button>
      </div>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '@media print': {
      display: 'none',
    },
  }
});

export default withStyles(styles)(Footer);
