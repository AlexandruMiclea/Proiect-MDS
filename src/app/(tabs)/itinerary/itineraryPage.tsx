import { getAttractions, getPhotos } from '@/app/providers/TripAdvProvider';
import { apiKey } from '@/lib/tripadvisor';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { LocationQuery, LocationObj, PhotoQuery, sampleLocationData } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Button, View, Text, ActivityIndicator, StyleSheet, GestureResponderEvent } from 'react-native';
import LocationList from './locationList';
import { supabase } from '@/lib/supabase';
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const ItineraryPage = () => {
    const params = useLocalSearchParams();
    const [loaded, setLoaded] = useState(false);
    const [locationData, setLocationData] = useState<sampleLocationData[]>([]);
    const { session } = useAuth();
    const searchValueList = ["art gallery", "museum", "monument"]; // TODO add more
    const [buttonVisible, setButtonVisible] = useState(true);
    const colorScheme = useColorScheme();
    const mainColor = Colors[colorScheme ?? 'light'].tint;
    const [cityLat, setCityLat] = useState<string | null>(null);
    const [cityLon, setCityLon] = useState<string | null>(null);
    const [currentTemperature, setCurrentTemperature] = useState(null);

    useEffect(() => {
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

        const itineraryDataCall = async () => {
            let query: LocationQuery = {
                key: apiKey,
                searchQuery: "",
                category: "attractions",
                latLong: getCoordinates(),
                radius: 20,
                radiusUnit: "km"
            };

            for (var searchValue of searchValueList) {
                query.searchQuery = searchValue;
                const ans = await getAttractions({ reqParams: query });

                for (var location of ans.data.slice(0, 3)) {
                    let imgQuery: PhotoQuery = {
                        key: apiKey,
                        language: "en",
                        limit: 3
                    };
                    const photoAns = await getPhotos({ locationId: location.location_id, reqParams: imgQuery });
                    var urls: Array<{ imageUrl: string | null }> = [];
                    photoAns.data.forEach(x => urls.push({ imageUrl: x.images.large.url }));
                    var newLocation: sampleLocationData = {
                        title: location.name,
                        address: location.address_obj.address_string,
                        description: "",
                        images : urls// Now matches the updated type definition
                    };
                    setLocationData(locationData => [...locationData, newLocation]);
                }
            }
            setLoaded(true);
        };

        itineraryDataCall();
    }, [setLoaded, setLocationData]);

    if (!loaded) {
        return (
            <View style={styles.loadingScreen}>
                <ActivityIndicator size="large" color="tint" />
            </View>
        );
    } else {
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

            const locationPromises = locationData.map(loc => {
                const locationData = {
                    id_itinerar: newItineraryId,
                    title: loc.title,
                    description: loc.description,
                    address: loc.address,
                    photo1: loc.images[0]?.imageUrl || null,
                    photo2: loc.images[1]?.imageUrl || null,
                    photo3: loc.images[2]?.imageUrl || null,
                    photo4: loc.images[3]?.imageUrl || null,
                    photo5: loc.images[4]?.imageUrl || null
                };

                return supabase.from('locations').insert([locationData]);
            });

            const locationResults = await Promise.all(locationPromises);

            locationResults.forEach(({ error }) => {
                if (error) {
                    console.error("Error saving location:", error);
                }
            });

            console.log("Data saved successfully");
        }

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
