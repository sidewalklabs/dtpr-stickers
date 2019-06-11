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
    return (
      <Switch>
        <Route exact path='/' component={PlaceList} />} />
        <Route path='/places/new' component={CreatePlaceView} />
        <Route path='/places/:placeId/edit' component={EditPlaceView} />
        <Route path='/places/:placeId' component={PlaceView} />
      </Switch>
    );
  }
}

export default withRouter(Places);
