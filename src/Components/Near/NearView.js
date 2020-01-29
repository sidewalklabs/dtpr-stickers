import React, {Component} from 'react';
import MapGL, {Popup, NavigationControl, ScaleControl, Marker} from 'react-map-gl';
import firebase from '../../firebase.js';
import UserIcon from '@material-ui/icons/Brightness1';
import Pins from './pins';
import CityInfo from './city-info';

import CITIES from './cities.json';

const fullscreenControlStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const navStyle = {
  position: 'absolute',
  top: 36,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  position: 'absolute',
  bottom: 36,
  left: 0,
  padding: '10px'
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: "8px"
};

const geolocateStyle = {
  position: 'absolute',
  top: 10,
  right: 10
};

const userIconStyle = {
  fill: 'green'
};

let userLocationWatch;

class NearView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: '100vw',
        height: '100vh',
        latitude: 37.785164,
        longitude: -100,
        zoom: 3.5,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null,
      userLocation: null,
      places: null
    };
    this.updateUserLocation = this.updateUserLocation.bind(this);
  }

  updateViewport = viewport => {
    this.setState({viewport});
  };

  onClickMarker = city => {
    this.setState({popupInfo: city});
  };

  renderPopup() {
    const {popupInfo} = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({popupInfo: null})}
        >
          <CityInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  getMapBoundaries = () => {
    // Get map boundaries
    const myMap = this.mapReference.getMap();
    console.log(myMap.getBounds());
    const mapBoundaries = myMap.getBounds();
    this.setState({ mapBoundaries })
  }

  updateUserLocation(pos) {
    const { latitude, longitude } = pos.coords;
    const { viewport } = this.state;
    console.log(`================> Update user location latitude: ${latitude} longitude: ${longitude}`);
    const userLocation = {
      latitude,
      longitude
    };
    this.setState({ userLocation })
    this.updateViewport({
      ...viewport,
      longitude,
      latitude
    });
  };

  componentDidMount = () => {
    const { viewport } = this.state;
    this.updateViewport({
      ...viewport,
      zoom: 18 // set default zoom level
    });
    userLocationWatch = navigator.geolocation.watchPosition(this.updateUserLocation, console.log, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0 });
    const placesRef = firebase.database().ref(`places`);

    placesRef.once("value", snapshot => {
      if (snapshot) {
        let places = Object.values(snapshot.val());
        console.log(places);
        // apply any starting filters
        // adapt the data to this view
        const adapted = places.map(place => {
          return {
            ...place,
            longitude: place.lngLat.lng,
            latitude: place.lngLat.lat,
          }
        });
        if (adapted) {
          this.setState({
            places: adapted
          });
        }
      }
    }, console.log);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(userLocationWatch);
  }

  render() {
    console.log('==============> render()');
    const {viewport, userLocation, places} = this.state;
    const center = [viewport.latitude, viewport.longitude];
    console.log('==============> viewport: ', viewport);
    console.log('==============> places: ', places);
    return (
      <MapGL
        containerStyle={mapContainerStyle}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this.updateViewport}
        ref={ref => this.mapReference = ref}
        center={center}
      >
        {places && <Pins data={places} onClick={this.onClickMarker} />}
        { userLocation && <Marker latitude={userLocation.latitude} longitude={userLocation.longitude} key='userLocation'>
          <UserIcon style={userIconStyle}/>
        </Marker>
        }
        {this.renderPopup()}

        <div style={navStyle}>
          <NavigationControl />
        </div>
        <div style={scaleControlStyle}>
          <ScaleControl />
        </div>
        {/* <ControlPanel containerComponent={this.props.containerComponent} /> */}
      </MapGL>
    );
  }
}

export default NearView;
