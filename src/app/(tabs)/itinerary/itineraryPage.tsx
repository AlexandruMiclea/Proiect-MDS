import { getAttractions, getPhotos } from '@/app/providers/TripAdvProvider';
import { apiKey } from '@/lib/tripadvisor';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { LocationQuery, LocationObj, PhotoQuery, sampleLocationData } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState,  } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const ItineraryPage = () => {
    const params = useLocalSearchParams();
    
    // export type sampleLocationData = {
    //     title: string,
    //     description: string,
    //     address: string,
    //     images: [
    //         {
    //             imageUrl: string
    //         },
    //     ]
    // };

    const [loaded, setLoaded] = useState(false);
    const [locationData, setLocationData] = useState<sampleLocationData[]>([]);
    const searchValueList = ["art gallery", "museum", "monument"]; // TODO add more

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
            for (var searchValue of searchValueList){
                query.searchQuery = searchValue;
                const ans = await getAttractions({reqParams : query});
                // TODO for now I get 3 of each. We should add more based on the sliders of the authenticated user
                for (var location of ans.data.slice(0, 3)){
                    console.log(location.name);
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
                        description: "", images: urls
                    }
                    setLocationData(locationData => [...locationData, newLocation]);
                }
            }
            // TODO for each location get requests for the picture and description
            // TODO we can also get cost
            setLoaded(true);
        }
        itineraryDataCall();
    }, [setLoaded, setLocationData])

    if (!loaded) {
        // TODO change loading screen circle color
        return (<View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="tint"></ActivityIndicator>
        </View>)
    } else {
        console.log(params.startDate);
        console.log(params.endDate);
        console.log(params.country);
        console.log(params.city);
        console.log(params.budget);
        console.log(locationData);

        return (<View>
            <Text>here itinerary gets generated</Text>
            <Text></Text>
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