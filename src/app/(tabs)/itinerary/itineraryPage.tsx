import { getAttractions, getPhotos } from '@/app/providers/TripAdvProvider';
import { apiKey } from '@/lib/tripadvisor';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { LocationQuery, LocationObj, PhotoQuery, sampleLocationData } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState,  } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));
import LocationList from './locationList';
import { ScrollView } from 'react-native-virtualized-view'

const ItineraryPage = () => {
    const params = useLocalSearchParams();

    const [loaded, setLoaded] = useState(false);
    const [locationData, setLocationData] = useState<sampleLocationData[]>([]);
    const searchValueList = ["art gallery", "museum", "monument"]; // TODO add more
    const [cityLat, setCityLat] = useState<string | null>(null);
    const [cityLon, setCityLon] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    // useEffect is used for handling asynchronous operations. In our case, we want
    // to wait for the Tripadvisor API calls to be completed
    useEffect(() => {
        const latlng = getCoordinates();
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
        const itineraryDataCall = async () => {
            let query: LocationQuery = {
                key: apiKey,
                searchQuery: "",
                category: "attractions", // TODO we can also use geos for parks and such
                latLong: latlng,
                radius: 20,
                radiusUnit: "km"
            };
            let updatedLocationData = [...locationData]; //local copy of the current state and used for processing duplicates to avoid issues with async state updates (locationData is state managed with useState) 
            for (var searchValue of searchValueList){
                query.searchQuery = searchValue;
                const ans = await getAttractions({reqParams : query});
                // TODO for now I get 3 of each. We should add more based on the sliders of the authenticated user
                for (var location of ans.data.slice(0, 3)){
                    
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
                    if (!photoAns.data)  {
                        setErrorMessage("Locations for this city are missing necessary data. Please try again with another city.");
                        return;
                    }
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
            // TODO we can also get cost
            setLoaded(true);
        }
        itineraryDataCall();
    }, [setLoaded])

    if (!loaded) {
        return (<View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="#7975F8"></ActivityIndicator>
        </View>)
    } else {
   return (
        <View>
            {errorMessage ? (
                    <Text>{errorMessage}</Text>
            ) : (
                // <ScrollView>
                    <ScrollView>
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
                // </ScrollView>
            )}
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
    }
});