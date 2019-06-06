import React, { Component } from 'react';
import CreatePlaceView from './CreatePlaceView';
import EditPlaceView from './EditPlaceView';
import PlaceList from './PlaceList';
import PlaceView from './PlaceView';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import { LngLat } from 'mapbox-gl';

export interface PlaceData {
  name: string,
  lngLat: LngLat,
  sensors: { [sensorId: string]: boolean }
  admins: { [uid: string]: boolean },
}

class Places extends Component<any, any> {
  render() {
    const { uid } = this.props
    return (
      <Switch>
        <Route exact path='/' render={(props) => <PlaceList key={uid} {...props} uid={uid} />} />
        <Route path='/places/new' render={(props) => <CreatePlaceView key={uid} {...props} uid={uid} />} />
        <Route path='/places/:placeId/edit' render={(props) => <EditPlaceView key={uid} {...props} uid={uid} />} />
        <Route path='/places/:placeId' render={(props) => <PlaceView key={uid} {...props} uid={uid} />} />
      </Switch>
    );
  }
}

export default withRouter(Places);
