import React from 'react';
import shortid from "shortid";
import SensorForm from './SensorForm'

interface CreateSensorFormProps {
  placeId: string;
}

interface CreateSensorFormState {
  sensorId?: string;
}

class CreateSensorForm extends React.Component<CreateSensorFormProps, CreateSensorFormState> {
  constructor(props: any) {
    super(props);

    this.state = {
      sensorId: undefined
    };
  }

  componentDidMount() {
    let sensorId = shortid.generate()

    // 307 is a reserved preface we used for an intial set of hard-coded human-readable sensor ids
    // disallow future ids that begin with 307 in order to avoid collisions
    while (sensorId.indexOf('307') === 0) {
      sensorId = shortid.generate()
    }
    this.setState({ sensorId })
  }

  render() {
    const { sensorId } = this.state

    if (!sensorId) return null

    const sensorData = {
      name: '',
      placeId: this.props.placeId,
      headline: '',
      description: '',
      accountable: '',
      accountableDescription: '',
      purpose: [],
      techType: [],
      dataType: [],
      dataProcess: [],
      access: [],
      storage: [],
      phone: '',
      chat: '',
      email: '',
      onsiteStaff: false,
      logoRef: '',
      sensorImageRef: '',
    }

    return <SensorForm
      sensorId={sensorId}
      sensorData={sensorData}
    />
  }
}

export default CreateSensorForm;