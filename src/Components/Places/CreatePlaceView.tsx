import React from 'react';
import shortid from "shortid";
import PlaceForm from './PlaceForm'
import { withRouter } from 'react-router-dom'
import { LngLat } from 'mapbox-gl';

class CreatePlaceView extends React.Component<any, any> {
  render() {
    return <PlaceForm
      id={shortid.generate()}
      title={"Create a New Place"}
      name={''}
      uid={this.props.uid}
      sensors={{}}
      admins={{}}
      onSave={(id: string) => this.props.history.push(`/places/${id}`)} />
  }
}

export default withRouter(CreatePlaceView);