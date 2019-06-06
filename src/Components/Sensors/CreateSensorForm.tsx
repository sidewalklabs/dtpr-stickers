import React from 'react';
import shortid from "shortid";
import SensorForm from './SensorForm'

interface CreateSensorFormProps {
  placeId: string;
}

class CreateSensorForm extends React.Component<CreateSensorFormProps, any> {
  render() {
    return <SensorForm
      sensorId={shortid.generate()}
      name=''
      placeId={this.props.placeId}
      headline=''
      description=''
      accountable=''
      accountableDescription=''
      purpose={[]}
      techType={[]}
      dataType={[]}
      dataProcess={[]}
      access={[]}
      storage={[]}
      phone=''
      chat=''
      email=''
      onsiteStaff={false}
      logoRef=''
      sensorImageRef=''
    />
  }
}

export default CreateSensorForm;