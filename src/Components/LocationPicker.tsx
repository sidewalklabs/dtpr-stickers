import React, { Component } from 'react';
import * as MapboxGL from 'mapbox-gl';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import PlaceIcon from '@material-ui/icons/Place';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Geocoder, { MapboxQueryFeature } from './Geocoder';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  injectCSS: false,
});

interface Props {
  markerLocation?: [number, number];
  onSelectLocation: (location: MapboxGL.LngLat, address: string) => void
  readonly classes: any;
}

class LocationPicker extends Component<Props, any> {
  map: any;
  mapContainer: any;

  onSelectLocation(f: MapboxQueryFeature) {
    console.log(f)
    const { center, place_name: address } = f
    const lngLat = MapboxGL.LngLat.convert(center)
    this.props.onSelectLocation(lngLat, address)
  }

  render() {
    const { markerLocation, classes } = this.props
    return (
      <Map
        style={'mapbox://styles/lope/cjws7757q0ase1cn2blgpu7hy'}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        center={markerLocation}
      >
        <div className={classes.geocoderContainer}>
          <Geocoder onSelectFeature={(f: MapboxQueryFeature) => this.onSelectLocation(f)} />
        </div>
        {markerLocation && <Marker
          coordinates={markerLocation}
        >
          <PlaceIcon color='primary' fontSize='large' />
        </Marker>}
      </Map>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  geocoderContainer: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    left: theme.spacing.unit * 2,
  },
});

export default withStyles(styles, { withTheme: true })(LocationPicker);
