import React, { Component } from 'react';
import PlaceForm from './PlaceForm';
import PlaceList from './PlaceList';
import PlaceView from './PlaceView';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom'

class Places extends Component<any, any> {
  render() {
    const { uid } = this.props
    return (
      <Switch>
        <Route exact path={this.props.match.path} render={(props) => <PlaceList key={uid} {...props} uid={uid} />} />
        <Route path={`${this.props.match.path}/new`} render={(props) => <PlaceForm key={uid} {...props} uid={uid} />} />
        <Route path={`${this.props.match.path}/:placeId`} render={(props) => <PlaceView key={uid} {...props} uid={uid} />} />
      </Switch>
    );
  }
}

export default withRouter(Places);
