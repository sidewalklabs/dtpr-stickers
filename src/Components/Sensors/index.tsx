import React, { Component } from 'react';
import SensorForm from './SensorForm';
import SensorPrintView from './SensorPrintView';
import SensorView from './SensorView';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom'

export interface SensorData {
  admins: { [uid: string]: boolean },
  placeId: string,
  name: string,
  headline: string,
  description: string
  accountable: string,
  accountableDescription: string,
  purpose: string[],
  techType: string[],
  dataType: string[],
  dataProcess: string[],
  access: string[],
  storage: string[],
  phone: string,
  chat: string,
  email: string,
  onsiteStaff: string,
  logoRef: string,
  sensorImageRef: string,
}

class Sensors extends Component<any, any> {
  render() {
    const { uid } = this.props
    SensorView
    return (
      <Switch>
        <Route path={`${this.props.match.path}/new`} render={(props) => <SensorForm key={uid} {...props} uid={uid} />} />
        <Route path={`${this.props.match.path}/:sensorId/print`} render={(props) => <SensorPrintView key={uid} {...props} uid={uid} />} />
        <Route path={`${this.props.match.path}/:sensorId`} render={(props) => <SensorView key={uid} {...props} uid={uid} />} />
      </Switch>
    );
  }
}

export default withRouter(Sensors);
