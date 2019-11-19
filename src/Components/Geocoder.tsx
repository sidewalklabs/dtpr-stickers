import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import PlaceIcon from '@material-ui/icons/Place';
import SearchIcon from '@material-ui/icons/Search';
import { Feature, Point } from 'geojson';
import React, { useEffect, useRef, useState } from 'react';

const styles = (theme: Theme) => createStyles({
  root: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
  },
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  transitionContainer: {
    height: 0,
    transition: 'height 0.3s ease',
  },
});

export interface MapboxQueryFeature extends Feature<Point> {
  id: string;
  center: [number, number];
  place_type: string;
  relevance: number;
  text: string;
  place_name: string;
  matching_text?: string;
  matching_place_name?: string;
}

// Taken from https://docs.mapbox.com/api/search/#geocoding-response-object
interface MapboxResponse {
  type: 'FeatureCollection';
  query: string[];
  features: MapboxQueryFeature[];
  attribution: string;
}

async function search(query: string, callback: (locations: MapboxQueryFeature[]) => void) {
  const uri =
    'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/' +
    encodeURIComponent(query) +
    '.json' +
    '?access_token=' +
    process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  const response = await fetch(uri);
  const json: MapboxResponse = await response.json();
  // TODO: this could cause unexpected search overriding given that each call is async
  // In the future we probably want to await each response or cancel if a new request is sent
  callback(json.features);
}

interface Props {
  onSelectFeature: (feature: MapboxQueryFeature) => void;
  readonly classes: any;
}

const Geocoder: React.FC<Props> = ({ onSelectFeature, classes }) => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<MapboxQueryFeature[]>([]);

  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(document.createElement('div'));

  // set height of transition wrapper when results content height changes
  // to trigger a css height transition
  useEffect(() => {
    setHeight(ref.current.clientHeight);
  }, [results]);

  // search for places when value of the searchbar changes
  useEffect(() => {
    if (value) {
      search(value, setResults);
    } else {
      // reset the results when user clears input
      setResults([]);
    }
  }, [value]);

  const onSelect = (feature: MapboxQueryFeature) => {
    setResults([]);
    onSelectFeature(feature)
  }

  return (
    <Paper className={classes.root}>
      <Paper className={classes.searchBar}>
        <InputBase
          className={classes.input}
          placeholder="Search"
          inputProps={{ 'aria-label': 'Search' }}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />
        {!results.length && (
          <IconButton
            className={classes.iconButton}
            onClick={() => value && search(value, setResults)}
            aria-label="Search">
            <SearchIcon />
          </IconButton>
        )}
        {!!results.length && (
          <IconButton
            className={classes.iconButton}
            onClick={() => setResults([])}
            aria-label="Close">
            <CloseIcon />
          </IconButton>
        )}
      </Paper>
      <div className={classes.transitionContainer} style={{ height }}>
        <div ref={ref}>
          {!!results.length && (
            <List>
              {results.map(feature => {
                const address = (feature.properties && feature.properties.address) || undefined;
                return (
                  <ListItem
                    key={feature.id}
                    button
                    onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      onSelect(feature)
                    }>
                    <ListItemIcon>{address ? <PlaceIcon /> : <SearchIcon />}</ListItemIcon>
                    <ListItemText primary={feature.place_name} secondary={address} />
                  </ListItem>
                );
              })}
            </List>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(Geocoder);