import { count, range } from 'd3';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

const ItineraryPage = () => {
    const params = useLocalSearchParams();
    console.log(params.startDate);
    console.log(params.endDate);
    console.log(params.country);
    console.log(params.city);
    console.log(params.budget);
    return (
    <View>
        <Text>here itinerary gets generated</Text>
        <Text></Text>
    </View>)
}

export default ItineraryPage;