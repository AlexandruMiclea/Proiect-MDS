import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import places from '@assets/data/places';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PlaceGeneral from '@/components/PlaceGeneral';
import PlaceAttractions from '@/components/PlaceAttractions';
import PlaceTraditions from '@/components/PlaceTraditions';

const buttons : string[] = ["General", "Attractions", "Traditions"];

const PlaceDetailsScreen = () => {

    // using navigation so i can hide the tabBar on the placeDetailsScreen

    const navigation = useNavigation();

    useEffect(() => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            display: "none"
          }
        });
        return () => navigation.getParent()?.setOptions({
          tabBarStyle: undefined
        });
      }, [navigation]);

    // getting the place from the id that was sent in the layout

    const { id } = useLocalSearchParams();

    const place = places.find((p) => p.id.toString() === id)

    const [selectedButton, setSelectedButton] = useState<string>('General');

    if (!place) {
        return <Text>Place was not found! (error)</Text>
    }

    return (
      <View style={styles.container}>
          <Stack.Screen 
              options=
                  {{
                      title: `${place.name}, ${place.country}`,
                      headerTitleStyle: {
                          fontWeight: '700',
                          fontSize: 13,
                      }
                  }}/>
          <Image
                source={place.image}
                style={styles.image}
                resizeMode="cover"
            />

        <View style={styles.buttons}>
          {buttons.map(button => 
            <Pressable
              onPress={() => { setSelectedButton(button) }} 
              style={[
                styles.button, 
                {
                  backgroundColor: selectedButton === button ? 'white' : '#7975F8'
                  
                }
              ]} 
              key={button}
            >
              <Text 
                style={[
                  styles.buttonText, 
                  {
                    color: selectedButton === button ? '#7975F8' : 'white',
                    fontWeight: selectedButton === button ? '700' : '500',
                  }
                  ]}
              >
                {button}
              </Text>
            </Pressable>
          )}
        </View>

        {/* todo sytling la astea si sa apara info care trebuie*/}

        <View style={{ marginTop: 20 }}>
          {selectedButton === "General" && <PlaceGeneral info={[place.name ,place.primaryLanguage, place.secondaryLanguage, place.climate, place.price]}/>}
          {selectedButton === "Attractions" && <PlaceAttractions info={[place.attractions ,place.attractionDescription]}/>}
          {selectedButton === "Traditions" && <PlaceTraditions info={[place.traditions ,place.traditionsDescription]}/>}
        </View>

      </View>
    );
}

export default PlaceDetailsScreen;

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
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