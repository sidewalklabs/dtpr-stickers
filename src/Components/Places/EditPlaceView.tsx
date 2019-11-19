import React from 'react';
import Typography from '@material-ui/core/Typography';
import PlaceForm from './PlaceForm'
import LinearProgress from '@material-ui/core/LinearProgress';

import { Redirect, withRouter } from 'react-router-dom'
import firebase from '../../firebase.js';
import { LngLat } from 'mapbox-gl';
import { PlaceData } from '.';

interface EditPlaceViewState extends PlaceData {
  isLoading: boolean;
  placeId: string;
  allowAccess: boolean;
}

class EditPlaceView extends React.Component<any, EditPlaceViewState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      allowAccess: true,
      address: '',
      placeId: '',
      name: '',
      lngLat: new LngLat(0, 0),
      sensors: {},
      admins: {}
    };
  }

  async componentDidMount() {
    const user = firebase.auth().currentUser
    const { placeId } = this.props.match.params
    if (user && placeId) {
      const placeRef = firebase.database().ref(`places/${placeId}`)
      placeRef.on('value', (snapshot) => {
        if (snapshot) {
          const item = snapshot.val();
          const { name, address, lngLat, sensors = {}, admins } = item
          if (!admins || !admins[user.uid]) {
            this.setState({ isLoading: false, allowAccess: false })
          }
          this.setState({ placeId, address, name, lngLat, sensors: sensors, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      });
    } else {
      this.setState({ isLoading: false, allowAccess: false })
    }
  }

  render() {
    const { allowAccess, isLoading, placeId, name, lngLat, sensors } = this.state
    if (isLoading) return <LinearProgress color="secondary" />
    if (!allowAccess) return <Redirect to={`/places/${this.props.match.params.placeId}/`} />
    if (!placeId) return <Typography>Cant'seem to find this place :/</Typography>

    return <PlaceForm
      id={placeId}
      title={"Edit Place"}
      name={name}
      lngLat={lngLat}
      sensors={sensors}
      onSave={(id: string) => this.props.history.push(`/places/${placeId}`)} />
  }
}

export default withRouter(EditPlaceView);