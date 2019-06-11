import React, { Component } from 'react';
import firebase from '../firebase.js';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseui from 'firebaseui'
import { Redirect } from "react-router-dom";

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
  render() {
    const firebaseAuth = firebase.auth()
    if (firebaseAuth.currentUser) return <Redirect to='/' />

    return (
      <div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
      </div>
    );
  }
}

export default Authentication;
