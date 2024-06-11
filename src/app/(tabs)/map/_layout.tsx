import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import { supabase } from "@/lib/supabase";

const WorldMap = () => {
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch itinerary data from Supabase
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data, error } = await supabase
          .from('itineraries')
          .select("*");

        if (error) {
          throw error;
        }

        const formattedCountries = data.map((itinerary) => ({
          name: itinerary.country,
          visitedCity: itinerary.city,
        }));

        setHighlightedCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching itineraries:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Load GeoJSON data
  const geoJsonData = require('assets/countries.geo.json');

  // Load list of countries to highlight
  // const highlightedCountries = require('assets/countries/highlightedCountries.json').countries;

  // Load detailed country data
  const countryDetails = require('assets/countries/countries.json');

  // Extract coordinates and centers for highlighted countries
  const markers = highlightedCountries.map(({ name, visitedCity }) => {
    const countryData = countryDetails[name];
    if (countryData) {
      const capitalCity = countryData.find((city) => city.name === visitedCity);
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
  }).filter((marker) => marker !== null);

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
        {/* Render GeoJSON features */}
        {geoJsonData.features.map((feature, index) => (
          <Geojson
            key={index}
            geojson={{
              type: 'FeatureCollection',
              features: [feature],
            }}
            strokeColor="#FFFFFF"
            fillColor={highlightedCountries.some((country) => country.name === feature.properties.name) ? "rgba(255,0,0,0.5)" : "rgba(0,0,0,0.5)"}
            strokeWidth={1}
          />
        ))}

        {/* Render markers for highlighted countries */}
        {markers.map((marker, index) => (
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
