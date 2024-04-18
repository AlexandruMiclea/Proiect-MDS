import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Geojson } from 'react-native-maps';

const WorldMap = () => {
  const geoJsonData = require('./assets/world_countries.geojson');

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 90,
          longitudeDelta: 180,
        }}
      >
        <Geojson
          geojson={geoJsonData}
          strokeColor="#FF0000"
          fillColor="rgba(255,0,0,0.5)"
          strokeWidth={1}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default WorldMap;
