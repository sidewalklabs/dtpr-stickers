import React, { Component } from 'react';
import * as MapboxGL from 'mapbox-gl';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import PlaceIcon from '@material-ui/icons/Place';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  injectCSS: false,
});

interface Props {
  markerLocation?: [number, number];
  onSelectLocation: (location: MapboxGL.LngLat) => void
}

class LocationPicker extends Component<Props, any> {
  map: any;
  mapContainer: any;

  onClick(map: MapboxGL.Map, evt: MapboxGL.MapMouseEvent) {
    this.props.onSelectLocation(evt.lngLat)
  }

  render() {
    const { markerLocation } = this.props
    return (
      <Map
        style={'mapbox://styles/lope/cjws7757q0ase1cn2blgpu7hy'}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        center={markerLocation}
        onClick={(map, evt) => this.onClick(map, evt as any)}
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

export default LocationPicker;
