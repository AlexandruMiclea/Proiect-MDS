import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Geojson } from 'react-native-maps';

const WorldMap = () => {
  const geoJsonData = require('assets/countries.geo.json');
  const romania = geoJsonData.features.find((feature: any) => feature.properties.name === 'Romania');

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
          strokeColor="#FFFFFF"
          fillColor="rgba(0,0,0,0.5)"
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
