import React, { Component } from 'react';
import EditSensorForm from './EditSensorForm';
import SensorPrintView from './SensorPrintView';
import SensorView from './SensorView';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom'

export interface SensorData {
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
  onsiteStaff: boolean,
  logoRef: string,
  sensorImageRef: string,
}

class Sensors extends Component<any, any> {
  render() {
    const { uid } = this.props
    return (
      <Switch>
        <Route path={`/sensors/:sensorId/print`} render={(props) => <SensorPrintView key={uid} {...props} />} />
        <Route path={`/sensors/:sensorId/edit`} render={(props) => <EditSensorForm key={uid} {...props} />} />
        <Route path={`/sensors/:sensorId`} render={(props) => <SensorView key={uid} {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Sensors);
