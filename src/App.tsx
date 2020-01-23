import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import common from "@material-ui/core/colors/common";
import HomeView from "./Components/HomeView";
import Places from "./Components/Places";
import Sensors from "./Components/Sensors";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
import firebase from "./firebase.js";

import Authentication from './Components/Authentication';
import Header from './Components/Header';
import Footer from './Components/Footer';
import CssBaseline from '@material-ui/core/CssBaseline';
import ReactGA from "react-ga";

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_KEY || '', {
  testMode: process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development',
});
ReactGA.set({ anonymizeIp: true });

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    background: {
      default: common.white
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: ["Google Sans", "Roboto", "-apple-system"].join(",")
  }
});

interface State {
  loading: boolean;
  isSignedIn: boolean;
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

class App extends Component<any, State> {
  state = {
    loading: true,
    isSignedIn: false,
    uid: undefined,
    email: undefined,
    displayName: undefined,
    photoURL: undefined
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      const {
        uid = undefined,
        email = undefined,
        displayName = undefined,
        photoURL = undefined
      } = user || {};
      this.setState({
        isSignedIn: !!user,
        uid,
        email,
        displayName,
        photoURL,
        loading: false
      });
    });
  }

  trackPageView() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const {
      loading,
      isSignedIn,
      uid,
      email,
      displayName,
      photoURL
    } = this.state;
    const showHeader = isSignedIn;
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {showHeader && (
            <Header
              loading={loading}
              isSignedIn={isSignedIn}
              email={email}
              displayName={displayName}
              photoURL={photoURL}
            />
          )}
          <div style={{ minHeight: 'calc(100vh - 180px)' }}>
            {!loading && <Router>
              <Switch>
                <Route key={uid || ''} path="/" exact render={(props) => {
                  this.trackPageView();
                  if (isSignedIn) {
                    return <Places key={uid} {...props} />
                  } else {
                    return <HomeView />
                  }
                }} />
                <Route path="/login" render={(props) => {
                  this.trackPageView();
                  return <Authentication {...props} />
                }} />
                <Route path="/places" render={(props) => {
                  this.trackPageView();
                  return <Places {...props} />
                }} />
                <Route path="/sensors" render={(props) => {
                  this.trackPageView();
                  return <Sensors {...props} />
                }} />
                <Route
                  exact
                  path="/:sensorId"
                  render={props => {
                    this.trackPageView();
                    return (
                      <Redirect
                        to={`/sensors/${props.match.params.sensorId}/`}
                      />
                    );
                  }}
                />
              </Switch>
            </Router>}
          </div>
          <Footer />
        </MuiThemeProvider>
      </React.Fragment >
    );
  }
}

export default App;
