import { StyleSheet, Text, Image, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { Place } from '@/types';
import { Link } from 'expo-router';

export const defaultPlaceImage = '@assets/images/placeholder.jpg'

type PlaceListItemProps = {
    place : Place;
}

const ExploreListItem = ({place}: PlaceListItemProps) => {

    // console.log(typeof('@assets/images/paris.png'));
    // console.log(place.image)
    // console.log("---")

    return (
    <Link href={`/explore/${place.id}`} asChild>
        <Pressable style={styles.container}>
            <Image
                // source={require('@assets/images/paris.png')}
                // source={require('../../assets/images/paris.png')}

                source={place.image}
                // source={require((place.image).toString())}
                // source={{uri: require(place.image || defaultPlaceImage)}} 
                // source={{uri: imagePath || defaultPlaceImage}} 
                style={styles.image}
                resizeMode="contain"
            />
        
            <Text style={styles.title}>Explore {place.name}</Text>
            <Text style={styles.price}>{place.price}</Text>
        
        </Pressable>
    </Link>);

}

export default ExploreListItem;

const styles = StyleSheet.create({
  
    container: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 40,
      flex: 1,
      maxWidth: '100%',
    },
  
    image: {
      width: 400,
      height: 200,
      borderColor: 'black',
      borderWidth: 2,
    //   aspectRatio: 1,
    },
  
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 10,
    },
    
    price: {
      color: Colors.light.tint,
      fontWeight: 'bold',
    }
  });