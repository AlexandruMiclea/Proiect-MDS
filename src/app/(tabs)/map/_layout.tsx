import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';

const WorldMap = () => {
  // Load GeoJSON data
  const geoJsonData = require('assets/countries.geo.json');

  // Load list of countries to highlight
  const highlightedCountries = require('assets/countries/highlightedCountries.json').countries;

  // Load detailed country data
  const countryDetails = require('assets/countries/countries.json');


  // Extract coordinates and centers for highlighted countries
  const markers = highlightedCountries.map(({ name, visitedCity }: { name: string, visitedCity: string }) => {
    const countryData = countryDetails[name];
    if (countryData) {
      const capitalCity = countryData.find((city: { name: string, lat: string, lon: string }) => city.name === visitedCity);
      if (capitalCity) {
        return {
          name: capitalCity.name,
          country: name,
          center: {
            latitude: parseFloat(capitalCity.lat),
            longitude: parseFloat(capitalCity.lon)
          }
        };
      }
    }
    return null;
  }).filter((marker: any) => marker !== null);

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
        {geoJsonData.features.map((feature: any, index: number) => (
          <Geojson
            key={index}
            geojson={{
              type: 'FeatureCollection',
              features: [feature],
            }}
            strokeColor="#FFFFFF"
            fillColor={highlightedCountries.some((country: any) => country.name === feature.properties.name) ? "rgba(255,0,0,0.5)" : "rgba(0,0,0,0.5)"}
            strokeWidth={1}
          />
        ))}
        {markers.map((marker: any, index: number) => (
          <Marker
            key={index}
            coordinate={marker.center}
            title={`${marker.name}, ${marker.country}`}
          />
        ))}
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
