import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import common from '@material-ui/core/colors/common';
import Home from './Components/Home';
import Places from './Components/Places';
import Sensors from './Components/Sensors';
import { BrowserRouter as Router, Switch, Redirect, Route, } from "react-router-dom";
import firebase from './firebase.js';

import Authentication from './Components/Authentication';
import Header from './Components/Header';
import CssBaseline from '@material-ui/core/CssBaseline';

import ReactGA from 'react-ga';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_KEY || '');

const HEADERED_PATHS = ['/', '/login']

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    background: {
      default: common.white,
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Google Sans',
      'Roboto',
      '-apple-system',
    ].join(','),
  },
});

interface State {
  loading: boolean,
  isSignedIn: boolean,
  uid?: string | null,
  email?: string | null,
  displayName?: string | null,
}

class App extends Component<any, State> {
  state = {
    loading: true,
    isSignedIn: false,
    uid: undefined,
    email: undefined,
    displayName: undefined,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        const { uid = undefined, email = undefined, displayName = undefined } = user || {}
        this.setState({ isSignedIn: !!user, uid, email, displayName, loading: false })
      }
    );
  }

  trackPageView() {
    console.log("page view:", window.location.pathname, window.location.search)
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const { loading, isSignedIn, uid, email, displayName } = this.state
    const showHeader = isSignedIn || HEADERED_PATHS.includes(window.location.pathname)
    console.log(this.props)
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme} >
          <CssBaseline />
          {showHeader && <Header loading={loading} isSignedIn={isSignedIn} />}
          {!loading && <Router>
            <Switch>
              <Route path="/" exact render={(props) => {
                this.trackPageView();
                if (isSignedIn) {
                  return <Places {...props} key={uid} uid={uid} />
                } else {
                  return <Home />
                }
              }} />
              <Route path="/login" render={(props) => {
                this.trackPageView();
                return <Authentication {...props} />
              }} />
              <Route path="/places" render={(props) => {
                this.trackPageView();
                return <Places {...props} key={uid} uid={uid} />
              }} />
              <Route path="/sensors" render={(props) => {
                this.trackPageView();
                return <Sensors {...props} key={uid} uid={uid} />
              }} />
              <Route
                exact
                path="/:sensorId"
                render={props => {
                  this.trackPageView();
                  return <Redirect to={`/sensors/${props.match.params.sensorId}/`} />
                }}
              />
            </Switch>
          </Router>}
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
