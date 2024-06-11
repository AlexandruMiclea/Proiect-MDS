import { getAttractions, getPhotos } from '@/app/providers/TripAdvProvider';
import { apiKey } from '@/lib/tripadvisor';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { LocationQuery, LocationObj, PhotoQuery, sampleLocationData } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View, Text, ActivityIndicator, StyleSheet, GestureResponderEvent, Platform } from 'react-native';
import LocationList from './locationList';
import { supabase } from '@/lib/supabase';
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
//import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import * as Calendar from 'expo-calendar'; // Import the calendar module

const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

/**
 * Represents the Itinerary Page component.
 */
const ItineraryPage = () => {
    const params = useLocalSearchParams();
    const [loaded, setLoaded] = useState(false);
    const [locationData, setLocationData] = useState<sampleLocationData[]>([]);
    const { session } = useAuth();
    const searchValueList = ["art gallery", "museum", "monument"]; 
    const [buttonVisible, setButtonVisible] = useState(true);
    const colorScheme = useColorScheme();
    const mainColor = Colors[colorScheme ?? 'light'].tint;
    const [cityLat, setCityLat] = useState<string | null>(null);
    const [cityLon, setCityLon] = useState<string | null>(null);
    const [currentTemperature, setCurrentTemperature] = useState(null);

    useEffect(() => {
        (async () => {
            // Request permission to access calendars
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access calendars denied');
                return;
            }

            // Permission granted, proceed with loading data
            loadData();
        })();
    }, []);

    /**
     * Loads the data for the itinerary page.
     */
    const loadData = async () => {
        const getCoordinates = () => {
            let answer = "";
            if (params.country != undefined){
                for (let city of countriesCities[params.country?.toString()]){
                    if (params.city != undefined) {
                        if (city.name === params.city) {
                            answer += city.lat + ',' + city.lon;
                            setCityLat(city.lat);
                            setCityLon(city.lon);
                        }
                    }
                }
            }
            return answer;
        };

        let locationDataArray: sampleLocationData[] = [];

        for (var searchValue of searchValueList) {
            const query: LocationQuery = {
                key: apiKey,
                searchQuery: searchValue,
                category: "attractions",
                latLong: getCoordinates(),
                radius: 20,
                radiusUnit: "km"
            };
            const ans = await getAttractions({ reqParams: query });

            for (var location of ans.data.slice(0, 3)) {
                const imgQuery: PhotoQuery = {
                    key: apiKey,
                    language: "en",
                    limit: 3
                };
                const photoAns = await getPhotos({ locationId: location.location_id, reqParams: imgQuery });
                const urls: Array<{ imageUrl: string | null }> = [];
                photoAns.data.forEach(x => urls.push({ imageUrl: x.images.large.url }));
                const newLocation: sampleLocationData = {
                    title: location.name,
                    address: location.address_obj.address_string,
                    description: "",
                    images : urls
                };
                locationDataArray.push(newLocation);
            }
        }

        setLocationData(locationDataArray);
        setLoaded(true);
    };

    /**
     * Handles the save button click event.
     * @param event - The event object.
     */
    async function handleSave(event: GestureResponderEvent): Promise<void> {
        setButtonVisible(false);
        console.log("Save button clicked");
        console.log(session?.user.id);
        const itineraryData = {
            profile_id: session?.user.id,
            city: params.city,
            country: params.country,
            start_date: params.startDate,
            final_date: params.endDate,
            budget: params.budget
        };

        const { data: newItinerary, error: itineraryError } = await supabase.from('itineraries').insert([itineraryData]).select();

        if (itineraryError) {
            console.error("Error saving itinerary:", itineraryError);
            return;
        }

        const newItineraryId = newItinerary[0].id;

        const defaultCalendarSource =
            Platform.OS === 'ios'
            ? await getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'Expo Calendar' };
            const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Trip Itinerary',
            color: mainColor,
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'Trip Itinerary',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        console.log(`Your new calendar ID is: ${newCalendarID}`);

        const startDateParts = params.startDate.split('.');
        const today = new Date(Number(startDateParts[2]), Number(startDateParts[1]) - 1, Number(startDateParts[0]));
        const endDateParts = params.endDate.split('.');
        const tomorrow = new Date(Number(endDateParts[2]), Number(endDateParts[1]) - 1, Number(endDateParts[0]));

        const details = {
            title: params.city,
            startDate: today,
            endDate: tomorrow,
            notes: `Itinerary for ${params.city}, ${params.country}`,
            location: ''
        };

        const eventId = await Calendar.createEventAsync(newCalendarID, details);

        // Save the event ID in the database
        const locationData = {
            id_itinerar: newItineraryId,
            title: params.city,
            description: `Itinerary for ${params.city}, ${params.country}`,
            address: '',
        };

        const { error: locationError } = await supabase.from('locations').insert([locationData]);

        if (locationError) {
            console.error("Error saving location:", locationError);
        }

        console.log("Data saved successfully");
    }

    if (!loaded) {
        return (
            <View style={styles.loadingScreen}>
                <ActivityIndicator size="large" color="tint" />
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {buttonVisible && (
                    <Pressable 
                        style={{...styles.button_save, backgroundColor: mainColor}} 
                        onPress={handleSave}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </Pressable>
                )}
                <Text style={styles.label}>{params.city}, {params.country}</Text>
                <Text style={styles.label}>{params.startDate} - {params.endDate}</Text>
                <Text style={styles.label}>Budget:  {params.budget} €</Text>
                <Text style={styles.label}>Temperature: 29°C</Text>
                <LocationList locations={locationData} />
            </View>
        );
    }
};

export default ItineraryPage;

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10
    },
    button_style: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    button_save: { 
        width: '60%', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 50, // Add height to ensure proper vertical centering
        padding: 10,
        marginTop: 20,
        marginBottom:10,
        borderRadius: 14
    }
});

async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
}
