import React from 'react';
import shortid from "shortid";
import PlaceForm from './PlaceForm'
import { withRouter } from 'react-router-dom'
import { LngLat } from 'mapbox-gl';

class CreatePlaceView extends React.Component<any, any> {
  render() {
    const defaultLngLat: LngLat = new LngLat(-79.361752, 43.647265);
    return <PlaceForm
      id={shortid.generate()}
      title={"Create a New Place"}
      name={''}
      lngLat={defaultLngLat}
      uid={this.props.uid}
      sensors={{}}
      admins={{}}
      onSave={(id: string) => this.props.history.push(`/places/${id}`)} />
  }
}

export default withRouter(CreatePlaceView);