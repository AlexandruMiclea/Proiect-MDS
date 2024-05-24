import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native'
import Location from './location';

const sampleLocationData = {
    title: "Beautiful Location",
    description: "A stunning location with breathtaking views.",
    address: "123 Scenic Drive, Beauty Town, Country",
    images: [
      { imageUrl: "https://i.imgur.com/pwpWaWu.jpg" },
      { imageUrl: "https://i.imgur.com/KIPtISY.jpg" },
      { imageUrl: "https://i.imgur.com/2jMCqQ2.jpg" },
      { imageUrl: "https://i.imgur.com/QFDRuAh.jpg" },
      { imageUrl: "https://i.imgur.com/8yIIokW.jpg" }
    ]
  };

const ItineraryPage = () => {
    const params = useLocalSearchParams();
    console.log(params.startDate);
    console.log(params.endDate);
    console.log(params.country);
    console.log(params.city);
    console.log(params.budget);
    return (
    <View style={{ flex: 1 }}>
        <Text>here itinerary gets generated</Text>
        <Text>Hello</Text>
        <Location {...sampleLocationData} />
    </View>)
}

export default ItineraryPage;