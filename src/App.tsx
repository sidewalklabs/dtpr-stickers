import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import common from '@material-ui/core/colors/common';
import Home from './Components/Home';
import Places from './Components/Places';
import Sensors from './Components/Sensors';
import { BrowserRouter as Router, Switch, Redirect, Route } from "react-router-dom";
import firebase from './firebase.js';

import Authentication from './Components/Authentication';
import Header from './Components/Header';
import CssBaseline from '@material-ui/core/CssBaseline';

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
  },
});

class App extends Component {
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

  render() {
    const { loading, isSignedIn, uid, email, displayName } = this.state
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme} >
          <CssBaseline />
          <Header loading={loading} isSignedIn={isSignedIn} />
          <Router>
            <Switch>
              <Route path="/" exact render={(props) => {
                if (isSignedIn) {
                  return <Places {...props} key={uid} uid={uid} />
                } else {
                  return <Home />
                }
              }} />
              <Route path="/login" component={Authentication} />
              <Route path="/places" render={(props) => <Places {...props} key={uid} uid={uid} />} />
              <Route path="/sensors" render={(props) => <Sensors {...props} key={uid} uid={uid} />} />
              <Route
                exact
                path="/:sensorId"
                render={props => (
                  <Redirect to={`/sensors/${props.match.params.sensorId}/`} />
                )}
              />
            </Switch>
          </Router>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
