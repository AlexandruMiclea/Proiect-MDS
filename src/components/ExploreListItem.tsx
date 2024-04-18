import { StyleSheet, Text, Image, Pressable, View } from 'react-native';
import { Place } from '@/types';
import { Link } from 'expo-router';

type PlaceListItemProps = {
    place : Place;
}

const ExploreListItem = ({place}: PlaceListItemProps) => {

    // console.log(typeof('@assets/images/paris.png'));
    // console.log(place.image)
    // console.log("---")

    return (
    <View style={styles.shadow}>
      <Link href={`/explore/${place.id}`} asChild>
          <Pressable style={styles.container}>
              <Image
                  // no idea why this works like this
                  // require ului din node nu ii plac chestiile dinamice si facea urat daca il aveam aici la compile time
                  // dar pus in json merge, vedem noi cum o sa fie cand luam din baza de date chestiile
                  source={place.image}
                  style={styles.image}
                  resizeMode="cover"
              />
          
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{place.price}</Text>
              </View>
              <View style={styles.exploreContainer}>
                <Text style={styles.title}>Explore {place.name}</Text>
              </View>

          
          </Pressable>


      </Link>
    </View>);

}

export default ExploreListItem;

const styles = StyleSheet.create({
  
    container: {
      backgroundColor: 'white',
      // padding: 40,
      borderRadius: 20,
      flex: 1,
      // maxWidth: '100%',
      position: 'relative',
      overflow: 'hidden',
      marginTop: 12,
      marginHorizontal: 10,

    },

    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 3,  
      elevation: 5,
    },
  
    image: {
      width: '100%',
      height: 180 ,
      //   aspectRatio: 1,
    },

    priceContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      padding: 7,
      opacity: 0.70,
      borderRadius: 25,
      right: 12,
      top: 8,
    },

    exploreContainer: {
      height: 50,
      justifyContent: 'center',
    },
  
    title: {
      fontSize: 17,
      fontWeight: '500',
      marginVertical: 10,
      left: 16,
    },
    
    price: {
      color: 'black',
      fontSize: 16,
    }
  });