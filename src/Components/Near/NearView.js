import React, {Component} from 'react';
import MapGL, {Popup, NavigationControl, ScaleControl, Marker} from 'react-map-gl';
import firebase from '../../firebase.js';
import UserIcon from '@material-ui/icons/Brightness1';
import Pins from './pins';
import TechTypeButton from './tech-type-button'; // eslint-disable-line no-unused-vars
import { getAirtableData } from '../../utils/airtable'

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

const userIconStyle = {
  fill: 'green',
  opacity: 1,
  transform: 'scale(0.5)'
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
        zoom: 18,
        bearing: 0,
        pitch: 0,
      },
      popupInfo: null,
      userLocation: null,
      places: null,
      sensors: null,
      airtableData: null,
      center: props.center && props.center.length === 2 ? props.center : null
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
    return (<div></div>);
  }

  getMapBoundaries = () => {
    // Get map boundaries
    const myMap = this.mapReference.getMap();
    const mapBoundaries = myMap.getBounds();
    this.setState({ mapBoundaries })
  }

  updateUserLocation(pos) {
    const { latitude, longitude } = pos.coords;
    const { viewport } = this.state;
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

  handleFormat = (event, formats) => {
    this.setState({formats});
  };

  techTypeButtonOnClick = (event, techType) => {
    console.dir(event);
    console.log(techType);
  };

  componentDidMount = async () => {
    const { viewport } = this.state;
    this.updateViewport({
      ...viewport,
      zoom: 18 // set default zoom level
    });
    if (this.state.center) {
      const coords = { latitude: this.state.center[0], longitude: this.state.center[1] };
      this.updateUserLocation({ coords })
    } else {
      userLocationWatch = navigator.geolocation.watchPosition(this.updateUserLocation, console.log, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 });
    }
    const placesRef = firebase.database().ref(`places`);
    placesRef.once("value", snapshot => {
      if (snapshot) {
        let places = Object.values(snapshot.val());
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

    const sensorsRef = firebase.database().ref(`sensors`);
    sensorsRef.once("value", snapshot => {
      if (snapshot) {
        let sensors = Object.values(snapshot.val());
        // apply any starting filters
        // adapt the data to this view
        const adapted = sensors.filter(sensor => sensor.longitude && sensor.latitude);
        if (adapted) {
          this.setState({
            sensors: adapted
          });
        }
      }
    }, console.log);

    // load airtable data last so screen can render and it feels faster
    const airtableData = await getAirtableData();
    this.setState({ airtableData });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(userLocationWatch);
  }

  render() {
    const {viewport, userLocation, sensors, airtableData} = this.state;
    const center = [viewport.latitude, viewport.longitude];
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
        {sensors && <Pins data={sensors} airtableData={airtableData} onClick={this.onClickMarker} classes={{}} iconShortName='tech/light'/>}
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
        {/* Example TechTypeButton */}
        {/* {airtableData && <TechTypeButton techType='Microphone' airtableData={airtableData} onClick={this.techTypeButtonOnClick} showCategory={true}/>} */}
      </MapGL>
    );
  }
}

export default NearView;
