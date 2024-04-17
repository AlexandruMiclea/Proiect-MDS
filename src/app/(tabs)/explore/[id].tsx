import { Text } from 'react-native';
import places from '@assets/data/places';
import { useLocalSearchParams } from 'expo-router';

const PlaceDetailsScreen = () => {

    const { id } = useLocalSearchParams();

    const place = places.find((p) => p.id.toString() === id)

    if (!place) {
        return <Text>Place was not found! (error)</Text>
    }

    return (

        <Text>{place.name}</Text>

    );


}

export default PlaceDetailsScreen;