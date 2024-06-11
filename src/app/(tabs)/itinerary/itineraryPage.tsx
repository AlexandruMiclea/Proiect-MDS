import { getAttractions, getPhotos } from '@/app/providers/TripAdvProvider';
import { apiKey } from '@/lib/tripadvisor';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { LocationQuery, LocationObj, PhotoQuery, sampleLocationData } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState,  } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));
import LocationList from './locationList';

const ItineraryPage = () => {
    const params = useLocalSearchParams();

    const [loaded, setLoaded] = useState(false);
    const [locationData, setLocationData] = useState<sampleLocationData[]>([]);
    const searchValueList = ["art gallery", "museum", "monument"]; // TODO add more
    const [cityLat, setCityLat] = useState<string | null>(null);
    const [cityLon, setCityLon] = useState<string | null>(null);
    const [currentTemperature, setCurrentTemperature] = useState(null);

    // useEffect is used for handling asynchronous operations. In our case, we want
    // to wait for the Tripadvisor API calls to be completed
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
        }
        const itineraryDataCall = async () => {
            let query: LocationQuery = {
                key: apiKey,
                searchQuery: "",
                category: "attractions", // TODO we can also use geos for parks and such
                latLong: getCoordinates(),
                radius: 20,
                radiusUnit: "km"
            };
            let updatedLocationData = [...locationData]; //local copy of the current state and used for processing duplicates to avoid issues with async state updates (locationData is state managed with useState) 
            for (var searchValue of searchValueList){
                query.searchQuery = searchValue;
                const ans = await getAttractions({reqParams : query});
                // TODO for now I get 3 of each. We should add more based on the sliders of the authenticated user
                for (var location of ans.data.slice(0, 3)){
                    console.log(location.name);
                    if (updatedLocationData.some(loc => loc.title === location.name)) {
                        console.log(`Skipping location: ${location.name} because it's a duplicate`);
                        continue; 
                    }
                    let imgQuery: PhotoQuery = {
                        key: apiKey,
                        language: "en",
                        limit: 3 // TODO can be changed
                    }
                    const photoAns = await getPhotos({locationId: location.location_id, reqParams: imgQuery});
                    var urls: [{imageUrl: string}?] = [];
                    photoAns.data.forEach(x => urls.push({imageUrl: x.images.large.url}));
                    var newLocation : sampleLocationData = {
                        title: location.name, 
                        address: location.address_obj.address_string, 
                        description: "", 
                        images: urls
                    }
                    updatedLocationData.push(newLocation);
                }
            }
            setLocationData(updatedLocationData);
            // TODO for each location get requests for the picture and description
            // TODO we can also get cost
            setLoaded(true);
        }
        itineraryDataCall();
    }, [setLoaded])

    //i need lat and lng to work
    // useEffect(()=>{
    //     const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
    //     const fetchCurrentWeather = async () => {
    //         try {
    //             const response = await fetch(url);
    //             if (!response.ok){
    //                 return;
    //             }
    //             const data = await response.json();
    //             setCurrentTemperature(data.current.temperature_2m);
    //         } catch (error){
    //             console.error("Error fetching current temperature: ", error);
    //         }
    //     }
    //     fetchCurrentWeather();
    // }, [])

    if (!loaded) {
        // TODO change loading screen circle color
        return (<View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="#7975F8"></ActivityIndicator>
        </View>)
    } else {
        return (
        <View>
            <LocationList locations={locationData}/>
        </View>)
    }
}

export default ItineraryPage;

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10
    }
})