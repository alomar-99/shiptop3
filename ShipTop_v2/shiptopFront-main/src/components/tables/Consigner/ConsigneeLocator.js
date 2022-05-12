import React, { useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { formatRelative } from "date-fns";

import mapStyles from "../../UI/MapStyles";
import { Button, makeStyles, Typography } from "@material-ui/core";

const libraries = ["places"];
const mapContainerStyle = {
  height: "50vh",
  width: "62vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

export default function ConsigneeLocator({ setCoord }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [marker, setMarker] = React.useState();
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
      
      setSelected(null)
    setMarker({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);
  if(!loadError && isLoaded){
  }
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <Typography variant="h5" color="secondary">
        Delivery Location:{" "}
      </Typography>

      <Locate panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        <Marker
          key={`${marker.lat}-${marker.lng}`}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker);
            setCoord(marker.lat + "," + marker.lng)
          }}
          icon={{
            url: `/location.svg`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <Typography variant="p" color="secondary">
                Location Confirmed
              </Typography>
              
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
const locateClasses = makeStyles({
  Button: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none",
    border: "none",
    zIndex: "10",
  },
  img: {
    width: "30px",
    cursor: "pointer",
  },
});
function Locate({ panTo }) {
  const classes = locateClasses;
  return (
    <Button
      className={classes.Button}
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img className={classes.img} src="/compass.svg" alt="compass" />
    </Button>
  );
}
