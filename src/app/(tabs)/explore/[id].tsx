import { Text, View, Image, StyleSheet } from 'react-native';
import places from '@assets/data/places';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


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

    if (!place) {
        return <Text>Place was not found! (error)</Text>
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: `Explore ${place.name}`}}/>
            <Image
                  // no idea why this works like this
                  // require ului din node nu ii plac chestiile dinamice si facea urat daca il aveam aici la compile time
                  // dar pus in json merge, vedem noi cum o sa fie cand luam din baza de date chestiile
                  source={place.image}
                  style={styles.image}
                  resizeMode="cover"
              />
            <Text>{place.name}, {place.country} 🧑</Text>
        </View>

    );


}

export default PlaceDetailsScreen;

const styles = StyleSheet.create({

    image: {
        top: 16,
        width: '80%',
        height: 200,
        //   aspectRatio: 1,
      },

});