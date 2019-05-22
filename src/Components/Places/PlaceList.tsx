import React, { Component } from 'react';
import firebase from '../../firebase.js';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'calc(100% - 167px)',
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 4,
    },
  },
  cardActionArea: {
    height: '200px',
  },
  addPlaceButton: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class PlaceList extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      places: [],
    };
  }

  componentDidMount() {
    const { uid } = this.props

    const placesRef = firebase.database().ref(`/users/${uid}/places`);
    placesRef.on('value', (snapshot) => {
      if (snapshot) {
        let places = snapshot.val();
        let newState = [];
        for (let placeId in places) {
          newState.push({
            id: placeId,
            name: places[placeId],
          });
        }
        this.setState({
          places: newState
        });
      }
    });
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h5" component="h2">My Places Dashboard</Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={classes.card}>
              <CardActionArea className={classes.cardActionArea} href="/places/new">
                <CardContent className={classes.addPlaceButton}>
                  <AddIcon fontSize='large' color='primary' />
                  <Typography color='primary' gutterBottom variant="subtitle2" component="h2">
                    Add a Place
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {this.state.places.map((place: any) => {
            const { id, name } = place
            return (
              <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                  <CardActionArea className={classes.cardActionArea} href={`/places/${id}`}>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PlaceList);
