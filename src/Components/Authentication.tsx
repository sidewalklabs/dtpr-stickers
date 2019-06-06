import firebase from '../firebase.js';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseui from 'firebaseui'

import React, { Component } from 'react';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        // restrict to display of swl emails only
        hd: 'sidewalklabs.com',
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account',
      }
    },
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

class Authentication extends Component<any, any> {
  state = {
    isSignedIn: false
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        this.setState({ isSignedIn: !!user })
      }
    );
  }

  render() {
    const firebaseAuth = firebase.auth()
    if (!this.state.isSignedIn) {
      return (
        <div>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
        </div>
      );
    }
    return (
      <div>
        <div>
          <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
      </div>
    );
  }
}

export default Authentication;
