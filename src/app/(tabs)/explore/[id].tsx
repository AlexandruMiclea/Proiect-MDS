import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Stack, useLocalSearchParams } from 'expo-router';
import places from '@assets/data/places';
import PlaceGeneral from '@/components/PlaceGeneral';
import PlaceAttractions from '@/components/PlaceAttractions';
import PlaceTraditions from '@/components/PlaceTraditions';

const buttons = ["General", "Attractions", "Traditions"];

const PlaceDetailsScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [selectedButton, setSelectedButton] = useState('General');
  const place = places.find((p) => p.id.toString() === id);

  useEffect(() => {
    // Hide the tabBar on the placeDetailsScreen
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none"
      }
    });
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: undefined
    });
  }, [navigation]);

  if (!place) {
    // Display an error message if the place was not found
    return <Text>Place was not found! (error)</Text>;
  }

  const handleButtonPress = (button: string) => {
    setSelectedButton(button);
  };

  return (
    <View style={styles.container}>
      {/* Screen title */}
      <Stack.Screen
        options={{
          title: `${place.name}, ${place.country}`,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 13,
          },
        }}
      />

      {/* Place image */}
      <Image source={place.image} style={styles.image} resizeMode="cover" />

      {/* Buttons for selecting different sections */}
      <View style={styles.buttons}>
        {buttons.map((button) => (
          <Pressable
            onPress={() => handleButtonPress(button)}
            style={[
              styles.button,
              {
                backgroundColor: selectedButton === button ? 'white' : '#7975F8',
              },
            ]}
            key={button}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: selectedButton === button ? '#7975F8' : 'white',
                  fontWeight: selectedButton === button ? '700' : '500',
                },
              ]}
            >
              {button}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content based on the selected button */}
      <View style={{ marginTop: 20, width: '100%', marginHorizontal: 10 }}>
        {selectedButton === "General" && (
          <PlaceGeneral
            info={[
              place.name,
              place.primaryLanguage,
              place.secondaryLanguage,
              place.climate,
              place.price,
            ]}
          />
        )}
        {selectedButton === "Attractions" && (
          <PlaceAttractions
            info={[place.attractions, place.attractionDescription]}
          />
        )}
        {selectedButton === "Traditions" && (
          <PlaceTraditions
            info={[place.traditions, place.traditionsDescription]}
          />
        )}
      </View>
    </View>
  );
};

export default PlaceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    top: 16,
    width: '84%',
    height: 200,
    borderRadius: 15,
  },
  buttons: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    width: '24%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
    marginTop: '8%',
    borderRadius: 8,
    borderColor: '#7975F8',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
  },
});
