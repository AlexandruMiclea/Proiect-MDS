import { getAttractions, getPhotos } from '@/app/providers/TripAdvProvider';
import { apiKey } from '@/lib/tripadvisor';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { LocationQuery, LocationObj, PhotoQuery, sampleLocationData } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, GestureResponderEvent, Platform } from 'react-native';
import LocationList from './locationList';
import { supabase } from '@/lib/supabase';
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
//import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import * as Calendar from 'expo-calendar'; // Import the calendar module
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));
import { ScrollView } from 'react-native-virtualized-view'

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
    const [isCelsiusActive, setIsCelsiusActive] = useState(true);
    const [temperature, setTemperature] = useState(0); //dureaza prea mult sa faca fetch

    const toggleTemperatureUnit = () => {
        setIsCelsiusActive(!isCelsiusActive);
        if (isCelsiusActive) {
            setTemperature(parseFloat(((temperature * 9) / 5 + 32).toFixed(2)));
        } else {
            setTemperature(parseFloat(((temperature - 32) / 1.8).toFixed(2)));
        }
      };
    const parseDate = (date:string | string[] | undefined) => {
        if (typeof date == 'string'){
            const dateParts = date.split('/');
            const dateObj = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
            const options: Intl.DateTimeFormatOptions = {  
                month: "short",
                day: "numeric"
            };
            const formattedDate = dateObj.toLocaleDateString('en-US', options); 
            return formattedDate;
        }
    }
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
                searchQuery: "",
                category: "attractions", // TODO we can also use geos for parks and such
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLon}&current=temperature_2m`;
        const fetchCurrentWeather = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok){
                    return;
                }
                const data = await response.json();
                console.log(data.current.temperature_2m);
                setTemperature(data.current.temperature_2m);
            } catch (error){
                console.error("Error fetching current temperature: ", error);
            }
        }
        fetchCurrentWeather();
        setLoaded(true);
    };

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
            calendarId: newCalendarID,
            eventId
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
        <View>
            <ScrollView>
                    {buttonVisible && (
            <Pressable 
                style={{...styles.button_save, backgroundColor: mainColor}} 
                onPress={handleSave}
            >
                <Text style={styles.buttonText}>Save</Text>
            </Pressable>
        )}
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.title}>{params.city}, {params.country}</Text>
                    <Text style={styles.dates}>{parseDate(params.startDate)} - {parseDate(params.endDate)}</Text>
                </View>
                <View>
                    
                    <View style={styles.temperatureContainer}>
                        <Text style={styles.weather}>{temperature}</Text>
                        <TouchableOpacity onPress={toggleTemperatureUnit}>
                            <Text style={[styles.weather, !isCelsiusActive && styles.inactiveText]}>°C</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleTemperatureUnit}>
                            <Text style={[styles.weather, isCelsiusActive && styles.inactiveText]}> | °F </Text>
                        </TouchableOpacity>
                    </View>
                    <Text>Budget: {params.budget}€</Text>
                </View>
            </View>
            <LocationList locations={locationData} />
            </ScrollView>
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
    detailsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:20,
      },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom:10,
    },
    dates: {
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    temperatureContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:4,
    },
    weather: {
        fontSize: 24,
        fontWeight:'500',
    },
    inactiveText:{
        color:'#c2c0c0',
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
