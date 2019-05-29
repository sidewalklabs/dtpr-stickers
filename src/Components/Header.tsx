import firebase from '../firebase.js';
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Header extends Component<any, any> {
  render() {
    const { isSignedIn, loading, classes } = this.props
    return (
      <AppBar className={classes.root} position="sticky">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Button href="/" color="inherit" disableFocusRipple disableRipple style={{ backgroundColor: 'transparent' }}>
              <Typography variant="h6" color="inherit" style={{ textTransform: 'none' }}>
                Data Transparency in the Public Realm
              </Typography>
            </Button>
          </div>
          <div style={{ flexShrink: 0 }}>
            {!loading && !isSignedIn && <Button href="/login" color="inherit">
              <Typography color="inherit" style={{ textTransform: 'none' }}>
                Login
              </Typography>
            </Button>}
            {!loading && isSignedIn && (
              <Button onClick={() => firebase.auth().signOut()} color="inherit" disableFocusRipple disableRipple style={{ backgroundColor: 'transparent' }}>
                <Typography color="inherit" style={{ textTransform: 'none' }}>
                  Sign Out
                </Typography>
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}




const styles = (theme: Theme) => createStyles({
  root: {
    '@media print': {
      display: 'none',
    },
  },
});

export default withStyles(styles)(Header);
