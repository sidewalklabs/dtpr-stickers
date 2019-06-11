import React, { Component } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import PlaceIcon from '@material-ui/icons/Place';

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '',
  injectCSS: false,
  interactive: false,
});

interface Props {
  markerLocation?: [number, number];
  center: [number, number];
}

class StaticMap extends Component<Props, any> {
  map: any;
  mapContainer: any;

  render() {
    const { markerLocation, center } = this.props
    return (
      <Map
        style={'mapbox://styles/lope/cjws7757q0ase1cn2blgpu7hy'}
        containerStyle={{
          width: "100%",
          height: "100%",
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '16px',
        }}
        center={center}
        zoom={[13]}
      >
        {markerLocation && <Marker
          coordinates={markerLocation}
        >
          <PlaceIcon color='primary' fontSize='large' />
        </Marker>}
      </Map>
    );
  }
}

export default StaticMap;
