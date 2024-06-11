import { StyleSheet, Text, Image, Pressable, View } from 'react-native';
import { Place } from '@/types';
import { Link } from 'expo-router';

type PlaceListItemProps = {
  place : Place;
}

// ExploreListItem component
const ExploreListItem = ({place}: PlaceListItemProps) => {

  return (
    <View style={styles.shadow}>
      {/* Link to the explore page for the specific place */}
      <Link href={`/explore/${place.id}`} asChild>
        <Pressable style={styles.container}>
          {/* Display the place image */}
          <Image
            source={place.image}
            style={styles.image}
            resizeMode="cover"
          />
        
          <View style={styles.priceContainer}>
            {/* Display the place price range */}
            <Text style={styles.price}>{place.price}</Text>
          </View>
          <View style={styles.exploreContainer}>
            {/* Display the place name */}
            <Text style={styles.title}>Explore {place.name}</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

export default ExploreListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    flex: 1,
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
