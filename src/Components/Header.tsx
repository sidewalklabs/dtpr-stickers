import firebase from '../firebase.js';
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

interface Props extends WithStyles<typeof styles> {
  loading: boolean,
  isSignedIn: boolean,
  email?: string | null,
  displayName?: string | null,
  photoURL?: string,
}

class Header extends Component<Props, any> {
  render() {
    const { isSignedIn, loading, classes, email, displayName, photoURL } = this.props
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
            {!loading && isSignedIn && <Tooltip title={`Sign out ${displayName} ${email}`}>
              <IconButton onClick={() => firebase.auth().signOut()} >
                <Avatar alt={displayName || ''} src={photoURL || undefined} className={classes.avatar}>
                  {!photoURL && displayName && displayName.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>}
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
  avatar: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  }
});

export default withStyles(styles)(Header);
